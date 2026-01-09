import { UserLikesProductEntity } from "../../../../application/command/entity/like/user-likes-product.entity";
import { IUserLikesProductCommandRepo } from "../../../../application/port/repo/command/like/user-likes-product.command.repo.interface";
import { BaseRepo } from "../../base.repo";

export class UserLikesProductCommandRepo
  extends BaseRepo
  implements IUserLikesProductCommandRepo
{
  async findLikeUserIdsByProduct(productId: string): Promise<string[]> {
    const likes = await this._prisma.productLike.findMany({
      where: {
        productId,
      },
      select: {
        userId: true,
      },
    });
    return likes.map((like) => like.userId);
  }

  async create(entity: UserLikesProductEntity): Promise<void> {
    await this._prisma.productLike.create({
      data: {
        userId: entity.userId,
        productId: entity.productId,
      },
    });
  }

  async delete(userId: string, productId: string): Promise<void> {
    await this._prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }
}
