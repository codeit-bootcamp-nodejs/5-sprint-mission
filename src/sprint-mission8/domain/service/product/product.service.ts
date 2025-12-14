import { IProductService } from "../../../inbound/port/services/product/product.service.interface";
import { CreateProductDto, DeleteProductDto, GetLikedProductsDto, GetProductDto, GetProductListDto, UpdateProductDto } from "../../../inbound/requests/product/product.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { ProductKeys, Sort } from "../../../types/query";
import { UserLikesProductEntity } from "../../entity/like/user-likes-product.entity";
import { ProductImageVo } from "../../entity/product/product-image.vo";
import { ProductTagVo } from "../../entity/product/product-tag.vo";
import { PersistProductEntity, ProductEntity } from "../../entity/product/product.entity";
import { TagEntity } from "../../entity/tag.entity";
import { BaseService } from "../base.service";

export class ProductService extends BaseService implements IProductService {

  async getProduct(dto: GetProductDto): Promise<PersistProductEntity> {
    const foundProduct = await this._repos.product.findProductById(dto.productId);
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

    const productTotalCount = await this._repos.product.count();
    if (productTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: productTotalCount });
    }

    const foundProductList = await this._repos.product.findProductList(
      offset,
      limit,
      orderBy,
    );

    return foundProductList;
  };

  async likeProduct(dto: GetLikedProductsDto): Promise<void> {
    const foundProduct = await this._repos.product.findProductById(dto.productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    const newUserLikesProduct = UserLikesProductEntity.createNew(dto);

    await this._repos.userLikesProduct.create(newUserLikesProduct);
  };

  async unlikeProduct(dto: GetLikedProductsDto): Promise<void> {
    const foundProduct = await this._repos.product.findProductById(dto.productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }
    await this._repos.userLikesProduct.delete(dto.userId, dto.productId);
  };

  async createProduct(dto: CreateProductDto): Promise<PersistProductEntity> {
    const { userId, name, description, price, tags, images } = dto;
    const foundProduct = await this._repos.product.findProductByName(name);

    if (foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_ALREADY_EXIST });
    }

    const createdTags = await this._repos.tag.findOrCreateTags(tags.map((v) => TagEntity.createNew({ name: v })));

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

    const newProduct = await this._repos.product.create(newProductEntity);

    return newProduct;
  };

  async updateProduct(dto: UpdateProductDto): Promise<PersistProductEntity> {
    const { userId, productId, name, description, price, tags, images } = dto;
    const foundProduct = await this._repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    if (userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }

    const createdTags = await this._repos.tag.findOrCreateTags(tags.map((v) => TagEntity.createNew({ name: v })));

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

    const updatedProduct = await this._repos.product.update(foundProduct);

    return updatedProduct;
  };

  async deleteProduct(dto: DeleteProductDto): Promise<void> {
    const foundProduct = await this._repos.product.findProductById(dto.productId);

    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }
    if (dto.userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }

    await this._repos.product.delete(dto.productId);
  };
}
