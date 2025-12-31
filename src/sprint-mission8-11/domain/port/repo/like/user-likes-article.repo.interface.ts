import { UserLikesArticleEntity } from "../../../entity/like/user-likes-article.entity";

export interface IUserLikesArticleRepo {
  create(entity: UserLikesArticleEntity): Promise<void>;
  delete(userId: string, articleId: string): Promise<void>;
}
