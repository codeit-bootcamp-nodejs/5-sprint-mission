import { services } from "../domain/service/services";
import { ArticleCommentController, IArticleCommentController } from "./controllers/article.comment.controller";
import { ArticleController, IArticleController } from "./controllers/article.controller";
import { ArticleLikeController, IArticleLikeController } from "./controllers/article.like.controller";
import { IImageController, ImageController } from "./controllers/image.controller";
import { IProductCommentController, ProductCommentController } from "./controllers/product.comment.controller";
import { IProductController, ProductController } from "./controllers/product.controller";
import { IProductLikeController, ProductLikeController } from "./controllers/product.like.controller";
import { IUserController, UserController } from "./controllers/user.controller";

export interface IControllers {
  user: IUserController;
  product: IProductController;
  productComment: IProductCommentController;
  productLike: IProductLikeController;
  article: IArticleController;
  articleComment: IArticleCommentController
  articleLike: IArticleLikeController;
  image: IImageController
}

export const controllers: IControllers = {
  user: new UserController(services),
  product: new ProductController(services),
  productComment: new ProductCommentController(services),
  productLike: new ProductLikeController(services),
  article: new ArticleController(services),
  articleComment: new ArticleCommentController(services),
  articleLike: new ArticleLikeController(services),
  image: new ImageController()
}