import { UserLikesArticleEntity } from "../../../domain/entity/like/user-likes-article.entity"
import { IUserLikesArticleRepo } from "../../../domain/port/repo/like/user-likes-article.repo.interface"
import { BaseRepo } from "../base.repo"

export class UserLikesArticleRepo extends BaseRepo implements IUserLikesArticleRepo{
  async create(entity: UserLikesArticleEntity): Promise<void> {
    await this._prisma.articleLike.create({
      data: {
        userId: entity.userId,
        articleId: entity.articleId
      }
    })
  }

  async delete(userId: string, articleId: string): Promise<void> {
    await this._prisma.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId
        }
      }
    })
  }
}