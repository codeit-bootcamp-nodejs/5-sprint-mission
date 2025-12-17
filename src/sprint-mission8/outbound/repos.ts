import { IUserRepo } from "../domain/port/repo/user.repo.interface";
import { IProductRepo } from "../domain/port/repo/product/product.repo.interface";
import { IProductCommentRepo } from "../domain/port/repo/product/product-comment.repo.interface";
import { IArticleCommentRepo } from "../domain/port/repo/article/article-comment.repo.interface";
import { IRepos } from "../domain/port/repos.interface";
import { IArticleRepo } from "../domain/port/repo/article/article.repo.interface";
import { IUserLikesArticleRepo } from "../domain/port/repo/like/user-likes-article.repo.interface";
import { ITagRepo } from "../domain/port/repo/tag.repo.interface";
import { IUserLikesProductRepo } from "../domain/port/repo/like/user-likes-product.repo.interface";
import { INotificationRepo } from "../domain/port/repo/notification.repo.interface";

export class Repos implements IRepos {
  constructor(
    public readonly user: IUserRepo,
    public readonly article: IArticleRepo,
    public readonly articleComment: IArticleCommentRepo,
    public readonly product: IProductRepo,
    public readonly productComment: IProductCommentRepo,
    public readonly tag: ITagRepo,
    public readonly userLikesProduct: IUserLikesProductRepo,
    public readonly userLikesArticle: IUserLikesArticleRepo,
    public readonly notification: INotificationRepo,
  ) { }
}