import { PersistProductEntity, NewProductEntity } from "../../../../command/entity/product/product.entity";

export interface IProductCommandRepo {
  findProductByName(name: string): Promise<PersistProductEntity | null>;
  findProductById(productId: string): Promise<PersistProductEntity | null>;
  findProductLike(
    userId: string,
    productId: string,
  ): Promise<PersistProductEntity | null>;
  create(entity: NewProductEntity): Promise<PersistProductEntity>;
  update(entity: PersistProductEntity): Promise<PersistProductEntity>;
  delete(productId: string): Promise<void>;
  count(): Promise<number>;
}
