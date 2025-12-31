import { IArticleCommentRepo } from "./repo/article/article-comment.repo.interface";
import { IArticleRepo } from "./repo/article/article.repo.interface";
import { IUserLikesArticleRepo } from "./repo/like/user-likes-article.repo.interface";
import { IUserLikesProductRepo } from "./repo/like/user-likes-product.repo.interface";
import { INotificationRepo } from "./repo/notification.repo.interface";
import { IProductCommentRepo } from "./repo/product/product-comment.repo.interface";
import { IProductRepo } from "./repo/product/product.repo.interface";
import { ITagRepo } from "./repo/tag.repo.interface";
import { IUserRepo } from "./repo/user.repo.interface";

export interface IRepos {
  user: IUserRepo;
  article: IArticleRepo;
  articleComment: IArticleCommentRepo;
  product: IProductRepo;
  productComment: IProductCommentRepo;
  tag: ITagRepo;
  userLikesProduct: IUserLikesProductRepo;
  userLikesArticle: IUserLikesArticleRepo;
  notification: INotificationRepo;
}
