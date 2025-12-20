import { NotificationType } from "@prisma/client";
import { IProductService } from "../../../inbound/port/services/product/product.service.interface";
import { CreateProductDto, DeleteProductDto, GetLikedProductsDto, GetProductDto, GetProductListDto, UpdateProductDto } from "../../../inbound/requests/product/product.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { ProductKeys, Sort } from "../../../types/query";
import { UserLikesProductEntity } from "../../entity/like/user-likes-product.entity";
import { NotificationEntity } from "../../entity/notification.entity";
import { ProductImageVo } from "../../entity/product/product-image.vo";
import { ProductTagVo } from "../../entity/product/product-tag.vo";
import { PersistProductEntity, ProductEntity } from "../../entity/product/product.entity";
import { TagEntity } from "../../entity/tag.entity";
import { NotificationPriceChangeEvent } from "../../event/notification-price-change.event";
import { IProductRepo } from "../../port/repo/product/product.repo.interface";
import { ITagRepo } from "../../port/repo/tag.repo.interface";
import { INotificationRepo } from "../../port/repo/notification.repo.interface";
import { IUserLikesProductRepo } from "../../port/repo/like/user-likes-product.repo.interface";
import { IEventBusUtil } from "../../../shared/util/event-bus.util";

export class ProductService implements IProductService {
  constructor(
    private readonly _productRepo: IProductRepo,
    private readonly _userLikesproductRepo: IUserLikesProductRepo,
    private readonly _tagRepo: ITagRepo,
    private readonly _notificationRepo: INotificationRepo,
    private readonly _evenBusUtil: IEventBusUtil
  ) {
  }
  async getProduct(dto: GetProductDto): Promise<PersistProductEntity> {
    const foundProduct = await this._productRepo.findProductById(dto.productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    return foundProduct;
  };

  async getProductList(dto: GetProductListDto): Promise<PersistProductEntity[]> {
    const { offset, limit, sort } = dto;

    const orderBy: { field: ProductKeys, sort: Sort } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : sort === "price-lowest"
          ? {
            field: "price",
            sort: "asc"
          }
          : {
            field: "price",
            sort: "desc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const productTotalCount = await this._productRepo.count();
    if (productTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: productTotalCount });
    }

    const foundProductList = await this._productRepo.findProductList(
      offset,
      limit,
      orderBy,
    );

    return foundProductList;
  };

  async likeProduct(dto: GetLikedProductsDto): Promise<void> {
    const foundProduct = await this._productRepo.findProductById(dto.productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    const newUserLikesProduct = UserLikesProductEntity.createNew(dto);

    await this._userLikesproductRepo.create(newUserLikesProduct);
  };

  async unlikeProduct(dto: GetLikedProductsDto): Promise<void> {
    const foundProduct = await this._productRepo.findProductById(dto.productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }
    await this._userLikesproductRepo.delete(dto.userId, dto.productId);
  };

  async createProduct(dto: CreateProductDto): Promise<PersistProductEntity> {
    const { userId, name, description, price, tags, images } = dto;
    const foundProduct = await this._productRepo.findProductByName(name);

    if (foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_ALREADY_EXIST });
    }

    const createdTags = await this._tagRepo.findOrCreateTags(tags.map((v) => TagEntity.createNew({ name: v })));

    const newProductEntity = ProductEntity.createNew({
      userId,
      name,
      description,
      price,
      tags: createdTags.map((v) => ProductTagVo.create({
        tagId: v.id,
        name: v.name
      })),
      images: images.map((v) => ProductImageVo.create({ url: v }))
    });

    const newProduct = await this._productRepo.create(newProductEntity);

    return newProduct;
  };

  async updateProduct(dto: UpdateProductDto): Promise<PersistProductEntity> {
    const { userId, productId, name, description, price, tags, images } = dto;
    const foundProduct = await this._productRepo.findProductById(productId);

    const prePrice = foundProduct?.price;

    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    if (userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }

    const createdTags = await this._tagRepo.findOrCreateTags(tags.map((v) => TagEntity.createNew({ name: v })));

    foundProduct.update({
      name,
      description,
      price,
      tags: createdTags.map((v) => ProductTagVo.create({
        tagId: v.id,
        name: v.name
      })),
      images: images.map((v) => ProductImageVo.create({ url: v }))
    });

    const updatedProduct = await this._productRepo.update(foundProduct);

    if (dto.price && dto.price !== prePrice) {
      const likeUserIds = await this._userLikesproductRepo.findLikeUserIdsByProduct(updatedProduct.id);


      if (likeUserIds.length > 0) {
        await Promise.all(
          likeUserIds.map(userId => {
            const notification = NotificationEntity.createNew({
              userId,
              type: NotificationType.PRODUCT_PRICE_CHANGED,
              message: "좋아요한 상품의 가격이 변동되었습니다.",
            });

            return this._notificationRepo.save(notification);
          })
        );

        this._evenBusUtil.publish(
          new NotificationPriceChangeEvent({
            productId: updatedProduct.id,
            userIds: likeUserIds,
            type: NotificationType.PRODUCT_PRICE_CHANGED,
            message: "좋아요한 상품의 가격이 변동되었습니다.",
          }),
        );
      }
    };
    return updatedProduct;
  }

  async deleteProduct(dto: DeleteProductDto): Promise<void> {
    const foundProduct = await this._productRepo.findProductById(dto.productId);

    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }
    if (dto.userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }

    await this._productRepo.delete(dto.productId);
  };
}
