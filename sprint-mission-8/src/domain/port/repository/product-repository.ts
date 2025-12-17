import { Favorite } from "@prisma/client";
import { PaginationQuery } from "../../../outbound/repository";
import {
  EditProductAttrs,
  NewProductAttrs,
  ProductEntity,
} from "../../entity/proudct-entity";
import { PersistedNotificationEntity } from "../../entity/notification-entity";

export interface IProductRepository {
  upload(
    productData: NewProductAttrs & { userId: number },
  ): Promise<ProductEntity>;
  loadDetail(productId: number): Promise<ProductEntity | null>;
  edit(
    productId: number,
    productData: EditProductAttrs,
  ): Promise<ProductEntity>;
  delete(productId: number): Promise<void>;
  loadAllProducts(query: PaginationQuery): Promise<ProductEntity[]>;
  loadUserProducts(
    userId: number,
    query: PaginationQuery,
  ): Promise<ProductEntity[]>;
  createFavorite(productId: number, userId: number): Promise<Favorite>;
  findFavorite(productId: number, userId: number): Promise<Favorite | null>;
  deleteFavorite(productId: number, userId: number): Promise<Favorite>;
  findFavoriteProductsByUserId(
    userId: number,
    query: PaginationQuery,
  ): Promise<ProductEntity[]>;
  findFavoriteUserIdsByProductId: (productId: number) => Promise<number[]>;
  editWithNotifications: (params: {
    productId: number;
    userId: number;
    data: EditProductAttrs;
    priceChange?: {
      oldPrice: number;
      newPrice: number;
      productName: string;
    } | null;
  }) => Promise<{
    product: ProductEntity;
    notifications: PersistedNotificationEntity[];
  }>;
}
