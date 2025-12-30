import { UserArticleView } from "../../../query/view/user/user.article.view";
import { UserCommentView } from "../../../query/view/user/user.comment.view";
import { UserProductView } from "../../../query/view/user/user.product.view";
import { UserView } from "../../../query/view/user/user.view";

export interface IUserQueryRepository {
  findById(id: string): Promise<UserView>;
  findProducts(id: string): Promise<UserProductView>;
  findArticles(id: string): Promise<UserArticleView>;
  findComments(id: string): Promise<UserCommentView>;
}
