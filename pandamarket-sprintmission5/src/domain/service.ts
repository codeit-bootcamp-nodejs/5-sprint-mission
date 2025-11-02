import { repository } from "../repositories/repository";
import { ArticleService, IArticleService } from "./services/article-serivce";
import { AuthService, IAuthService } from "./services/auth-service";
import { CommentService, ICommentService } from "./services/comment-service";
import { IProductService, ProductService } from "./services/product-service";
import { IUserService, UserService } from "./services/user-service";

export interface IService {
  user: IUserService;
  auth: IAuthService;
  article: IArticleService;
  product: IProductService;
  comment: ICommentService;
}

export const service: IService = {
  user: new UserService(repository),
  auth: new AuthService(repository),
  article: new ArticleService(repository),
  product: new ProductService(repository),
  comment: new CommentService(repository),
};
