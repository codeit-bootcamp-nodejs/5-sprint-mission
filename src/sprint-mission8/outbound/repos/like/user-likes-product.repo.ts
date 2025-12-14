import { UserLikesProductEntity } from "../../../domain/entity/like/user-likes-product.entity";
import { IUserLikesProductRepo } from "../../../domain/port/repo/like/user-likes-product.repo.interface";
import { BaseRepo } from "../base.repo";

export class UserLikesProductRepo extends BaseRepo implements IUserLikesProductRepo{
  async create(entity: UserLikesProductEntity): Promise<void> {
    await this._prisma.productLike.create({
      data: {
        userId: entity.userId,
        productId: entity.productId
      }
    })
  }

  async delete(userId: string, productId: string): Promise<void> {
    await this._prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })
  }
}