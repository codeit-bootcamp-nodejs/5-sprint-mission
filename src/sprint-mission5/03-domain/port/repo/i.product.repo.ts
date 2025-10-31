import { ProductListQueryType } from "../../../04-repo/product.repo";
import { ProductKeys } from "../../../types/query";
import { PersistedProductEntity, ProductEntity } from "../../entity/product.entity";

export interface IProductRepo {
  findProductByName: (name: string) => Promise<PersistedProductEntity | null>;
  findProductById: (productId: string) => Promise<PersistedProductEntity | null>;
  findProductLike: (userId: string, productId: string) => Promise<PersistedProductEntity | null>;
  findProductList: ({ offset, limit, orderBy }: ProductListQueryType) => Promise<PersistedProductEntity[]>;
  create: (entity: ProductEntity) => Promise<PersistedProductEntity>;
  addProductLike: (userId: string, productId: string) => Promise<PersistedProductEntity>;
  update: (entity: ProductEntity) => Promise<PersistedProductEntity>;
  updateProductLike: (userId: string, productId: string, isLiked: boolean) => Promise<PersistedProductEntity>;
  delete: (productId: string) => Promise<void>;
  count: () => Promise<number>
}