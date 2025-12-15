import BadRequestError from "../../shared/errors/BadRequestError";
import NotFoundError from "../../shared/errors/NotFoundError";
import { IRepository, PaginationQuery } from "../../outbound/repository";
import { EditProductAttrs, NewProductAttrs } from "../entity/proudct-entity";
import { BaseService } from "./base-service";
import { IProductService } from "../port/service/product-service";
import { NotificationType } from "@prisma/client";
import { PersistedNotificationEntity } from "../entity/notification-entity";

export class ProductService extends BaseService implements IProductService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async uploadProduct(productData: NewProductAttrs, userId: number) {
    if (!productData.name || !productData.price) {
      throw new BadRequestError("상품명과 가격은 필수입니다.");
    }

    const productDatawithUserId = { ...productData, userId };
    const product = await this.repository.product.upload(productDatawithUserId);

    return product;
  }

  async getProducts(query: PaginationQuery) {
    const processedQuery = {
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
    const products =
      await this.repository.product.loadAllProducts(processedQuery);

    return products;
  }

  async getProductDetail(productId: number) {
    const product = await this.repository.product.loadDetail(productId);
    if (!product)
      throw new NotFoundError("존재하지 않는 상품입니다.", productId);
    return product;
  }

  async editProduct(
    productId: number,
    userId: number,
    productData: EditProductAttrs,
  ) {
    const existing = await this.repository.product.loadDetail(productId);
    if (!existing)
      throw new NotFoundError("존재하지 않는 상품입니다.", productId);

    const priceChanged =
      typeof productData.price === "number" &&
      productData.price !== undefined &&
      productData.price !== existing.price;

    const updated = await this.repository.product.editWithNotifications({
      productId,
      userId,
      data: productData,
      priceChange: priceChanged
        ? {
            oldPrice: existing.price,
            newPrice: productData.price!,
            productName: existing.name,
          }
        : null,
    });

    const notifications: PersistedNotificationEntity[] = updated.notifications;

    return { product: updated.product, notifications };
  }

  async deleteProduct(productId: number) {
    const existing = await this.repository.product.loadDetail(productId);
    if (!existing)
      throw new NotFoundError("존재하지 않는 상품입니다.", productId);

    await this.repository.product.delete(productId);
    return true;
  }

  async getMyProducts(userId: number, query: PaginationQuery) {
    const processedQuery = {
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };

    return await this.repository.product.loadUserProducts(
      userId,
      processedQuery,
    );
  }

  async favoriteProduct(productId: number, userId: number) {
    const productExists = await this.repository.product.loadDetail(productId);
    if (!productExists)
      throw new NotFoundError("좋아요할 상품을 찾을 수 없습니다.", productId);

    const existingFavorite = await this.repository.product.findFavorite(
      productId,
      userId,
    );
    if (existingFavorite) {
      throw new BadRequestError("이미 좋아요를 누른 상품입니다.");
    }

    await this.repository.product.createFavorite(productId, userId);

    return;
  }

  async unfavoriteProduct(productId: number, userId: number) {
    const existingFavorite = await this.repository.product.findFavorite(
      productId,
      userId,
    );
    if (!existingFavorite) {
      throw new BadRequestError("취소할 좋아요 기록을 찾을 수 없습니다.");
    }

    await this.repository.product.deleteFavorite(productId, userId);
    return;
  }
}
