import { repos } from "../../outbound/repos";
import { managers } from "../../shared/util/managers";
import { ArticleService, IArticleService } from "./article.service";
import { AuthService, IAuthService } from "./auth.service";
import { CommentService, ICommentService } from "./comment.service";
import { IProductService, ProductService } from "./product.service";
import { IUserService, UserService } from "./user.service";

export interface IServices {
  user: IUserService;
  auth: IAuthService;
  article: IArticleService;
  product: IProductService;
  comment: ICommentService;
};

export const services : IServices = {
  user: new UserService(repos, managers),
  auth: new AuthService(repos, managers),
  article: new ArticleService(repos),
  product: new ProductService(repos),
  comment: new CommentService(repos),
};
