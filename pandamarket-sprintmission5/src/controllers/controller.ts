import { service } from "../domain/service";
import { ArticleController, IArticleController } from "./article-controller";
import { AuthController, IAuthController } from "./auth-controller";
import { CommentController, ICommentController } from "./comment-controller";
import { IImageController, ImageController } from "./image-controller";
import { IProductController, ProductController } from "./product-controller";
import { IUserController, UserController } from "./user-controller";

interface IController {
  user: IUserController;
  auth: IAuthController;
  article: IArticleController;
  prouduct: IProductController;
  comment: ICommentController;
  image: IImageController;
}

export const Controller: IController = {
  user: new UserController(service),
  auth: new AuthController(service),
  article: new ArticleController(service),
  prouduct: new ProductController(service),
  comment: new CommentController(service),
  image: new ImageController(service),
};
