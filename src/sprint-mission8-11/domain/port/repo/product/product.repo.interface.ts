import { ProductKeys, Sort } from "../../../../types/query";
import { NewProductEntity, PersistProductEntity } from "../../../entity/product/product.entity";

export interface IProductRepo {
  findProductByName(name: string): Promise<PersistProductEntity | null>;
  findProductById(productId: string): Promise<PersistProductEntity | null>;
  findProductLike(userId: string, productId: string): Promise<PersistProductEntity | null>;
  findProductList(offset: number, limit: number, orderBy: { field: ProductKeys, sort: Sort }): Promise<PersistProductEntity[]>;
  findUserLikeProducts(userId: string, offset: number, limit: number): Promise<PersistProductEntity[] | null>
  create(entity: NewProductEntity): Promise<PersistProductEntity>;
  update(entity: PersistProductEntity): Promise<PersistProductEntity>;
  delete(productId: string): Promise<void>;
  count(): Promise<number>;
}