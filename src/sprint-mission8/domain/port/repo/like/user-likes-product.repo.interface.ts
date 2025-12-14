import { UserLikesProductEntity } from "../../../entity/like/user-likes-product.entity";

export interface IUserLikesProductRepo {
  create(entity: UserLikesProductEntity): Promise<void>;
  delete(userId: string, productId: string): Promise<void>;
}