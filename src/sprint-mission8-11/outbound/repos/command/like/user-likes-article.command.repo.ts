import { UserLikesArticleEntity } from "../../../../application/command/entity/like/user-likes-article.entity";
import { IUserLikesArticleCommandRepo } from "../../../../application/port/repo/command/like/user-likes-article.command.repo.interface";
import { BaseRepo } from "../../base.repo";

export class UserLikesArticleCommandRepo
  extends BaseRepo
  implements IUserLikesArticleCommandRepo
{
  async create(entity: UserLikesArticleEntity): Promise<void> {
    await this._prisma.articleLike.create({
      data: {
        userId: entity.userId,
        articleId: entity.articleId,
      },
    });
  }

  async delete(userId: string, articleId: string): Promise<void> {
    await this._prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  }
}
