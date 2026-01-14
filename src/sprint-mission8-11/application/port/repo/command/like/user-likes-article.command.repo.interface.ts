import { UserLikesArticleEntity } from "../../../../command/entity/like/user-likes-article.entity";

export interface IUserLikesArticleCommandRepo {
  create(entity: UserLikesArticleEntity): Promise<void>;
  delete(userId: string, articleId: string): Promise<void>;
}
