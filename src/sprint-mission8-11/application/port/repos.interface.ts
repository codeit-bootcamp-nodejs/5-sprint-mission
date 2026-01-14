import { IArticleCommentCommandRepo } from "./repo/command/article/article-comment.command.repo.interface";
import { IArticleCommandRepo } from "./repo/command/article/article.command.repo.interface";
import { IUserLikesArticleCommandRepo } from "./repo/command/like/user-likes-article.command.repo.interface";
import { IUserLikesProductCommandRepo } from "./repo/command/like/user-likes-product.command.repo.interface";
import { INotificationCommandRepo } from "./repo/command/notification.command.repo.interface";
import { IProductCommentCommandRepo } from "./repo/command/product/product-comment.command.repo.interface";
import { IProductCommandRepo } from "./repo/command/product/product.command.repo.interface";
import { ITagCommandRepo } from "./repo/command/tag.command.repo.interface";
import { IUserCommandRepo } from "./repo/command/user.command.repo.interface";

export interface IRepos {
  user: IUserCommandRepo;
  article: IArticleCommandRepo;
  articleComment: IArticleCommentCommandRepo;
  product: IProductCommandRepo;
  productComment: IProductCommentCommandRepo;
  tag: ITagCommandRepo;
  userLikesProduct: IUserLikesProductCommandRepo;
  userLikesArticle: IUserLikesArticleCommandRepo;
  notification: INotificationCommandRepo;
}
