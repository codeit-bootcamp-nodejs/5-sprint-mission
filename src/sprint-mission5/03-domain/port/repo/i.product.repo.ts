import { ProductKeys, ProductListQueryType } from "../../../04-repo/product.repo";
import { ProductEntity } from "../../entity/product.entity";

export interface IProductRepo {
  findProductByName: (name: string) => Promise<ProductEntity | null>;
  findProductById: (productId: string) => Promise<ProductEntity | null>;
  findProductLike: (userId: string, productId: string) => Promise<ProductEntity | null>;
  findProductList: <Tkey extends ProductKeys>({ userId, offset, limit, orderBy }: ProductListQueryType<Tkey>) => Promise<ProductEntity[]>;
  create: (entity: ProductEntity) => Promise<ProductEntity>;
  addProductLike: (userId: string, productId: string) => Promise<ProductEntity>;
  update: (entity: ProductEntity) => Promise<ProductEntity>;
  updateProductLike: (userId: string, productId: string, isLiked: boolean) => Promise<ProductEntity>;
  delete: (productId: string) => Promise<void>;
  count: () => Promise<number>
}