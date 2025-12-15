import { IRepository } from "../outbound/repository";
import { ArticleService } from "./service/article-serivce";
import { AuthService } from "./service/auth-service";
import { CommentService } from "./service/comment-service";
import { ProductService } from "./service/product-service";
import { UserService } from "./service/user-service";
import { IUserService } from "./port/service/user-service";
import { IProductService } from "./port/service/product-service";
import { IAuthService } from "./port/service/auth-service";
import { IArticleService } from "./port/service/article-service";
import { ICommentService } from "./port/service/comment-service";
import { NotificationService } from "./service/notification-service";
import { INotificationService } from "./port/service/notification-service";

export interface IService {
  user: IUserService;
  auth: IAuthService;
  article: IArticleService;
  product: IProductService;
  comment: ICommentService;
  notification: INotificationService;
}

export const createService = (repository: IRepository): IService => ({
  user: new UserService(repository),
  auth: new AuthService(repository),
  article: new ArticleService(repository),
  product: new ProductService(repository),
  comment: new CommentService(repository),
  notification: new NotificationService(repository),
});
