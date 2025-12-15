import { UserLikesProductEntity } from "../../../entity/like/user-likes-product.entity";

export interface IUserLikesProductRepo {
  findLikeUserIdsByProduct(productId: string): Promise<string[]>;
  create(entity: UserLikesProductEntity): Promise<void>;
  delete(userId: string, productId: string): Promise<void>;
}