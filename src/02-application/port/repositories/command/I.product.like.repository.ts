import { PersistedProductLike } from "../../../command/entity/product.like";



export interface IProductLikeCommandRepository {
  toggle(
    userId: string,
    productId: string,
  ): Promise<PersistedProductLike | null>;

  findAll(productId: string): Promise<PersistedProductLike[] | null>;
}
