import { IArticleCommentService } from "./services/article/article-comment.service.interface";
import { IArticleService } from "./services/article/article.service.interface";
import { IAuthService } from "./services/auth.service.interface";
import { IProductCommentService } from "./services/product/product-comment.service.interface";
import { IProductService } from "./services/product/product.service.interface";
import { IUserService } from "./services/user.service.interface";

export interface IServices {
  user: IUserService;
  auth: IAuthService;
  article: IArticleService;
  articleComment: IArticleCommentService;
  product: IProductService;
  productComment: IProductCommentService;
};
