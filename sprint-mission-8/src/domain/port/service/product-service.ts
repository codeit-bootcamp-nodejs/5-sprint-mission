import { PaginationQuery } from "../../../outbound/repository";
import {
  EditProductAttrs,
  NewProductAttrs,
  ProductEntity,
} from "../../entity/proudct-entity";
import { PersistedNotificationEntity } from "../../entity/notification-entity";

export interface IProductService {
  uploadProduct: (
    productData: NewProductAttrs,
    userId: number,
  ) => Promise<ProductEntity>;
  getProducts: (query: PaginationQuery) => Promise<ProductEntity[]>;
  getProductDetail: (productId: number) => Promise<ProductEntity>;
  editProduct: (
    productId: number,
    userId: number,
    productData: EditProductAttrs,
  ) => Promise<{
    product: ProductEntity;
    notifications: PersistedNotificationEntity[];
  }>;
  deleteProduct: (productId: number) => Promise<boolean>;
  getMyProducts(
    userId: number,
    query: PaginationQuery,
  ): Promise<ProductEntity[]>;
  favoriteProduct(productId: number, userId: number): Promise<void>;
  unfavoriteProduct(productId: number, userId: number): Promise<void>;
}
