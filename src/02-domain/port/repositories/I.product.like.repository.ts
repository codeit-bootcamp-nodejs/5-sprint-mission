import { PersistedProductLike } from "../../entity/product.like";

export interface IProductLikeRepository {
  toggle(
    userId: string,
    productId: string,
  ): Promise<PersistedProductLike | null>;

  findAll(productId: string): Promise<PersistedProductLike[] | null>;
}
