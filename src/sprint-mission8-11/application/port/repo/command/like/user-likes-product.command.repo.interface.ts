import { UserLikesProductEntity } from "../../../../command/entity/like/user-likes-product.entity";

export interface IUserLikesProductCommandRepo {
  findLikeUserIdsByProduct(productId: string): Promise<string[]>;
  create(entity: UserLikesProductEntity): Promise<void>;
  delete(userId: string, productId: string): Promise<void>;
}
