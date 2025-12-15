import { Request, Response, Router } from "express";
import { ArticleController } from "./controllers/article-controller";
import { AuthController } from "./controllers/auth-controller";
import { CommentController } from "./controllers/comment-controller";
import { ImageController } from "./controllers/image-controller";
import { ProductController } from "./controllers/product-controller";
import { UserController } from "./controllers/user-controller";
import { NoticationController } from "./controllers/notification-controller";
import { IService } from "../domain/service";
import { Middlewares } from "./middlewares";
import { IConfigUtil } from "../shared/config";

interface IController {
  user: IUserController;
  auth: IAuthController;
  article: IArticleController;
  prouduct: IProductController;
  comment: ICommentController;
  image: IImageController;
  notification: INotificationController;
}

export const createControllers = (
  middlewares: Middlewares,
  service: IService,
  configUtil: IConfigUtil,
): IController => ({
  user: new UserController(middlewares, service, configUtil),
  auth: new AuthController(middlewares, service, configUtil),
  article: new ArticleController(middlewares, service, configUtil),
  prouduct: new ProductController(middlewares, service, configUtil),
  comment: new CommentController(middlewares, service, configUtil),
  image: new ImageController(middlewares, service, configUtil),
  notification: new NoticationController(middlewares, service, configUtil),
});

interface IBaseController {
  path: string;
  router: Router;
}

export interface IArticleController extends IBaseController {
  createArticle: (req: Request, res: Response) => Promise<void>;
  getArticles: (req: Request, res: Response) => Promise<void>;
  getArticleDetail: (req: Request, res: Response) => Promise<void>;
  updateArticle: (req: Request, res: Response) => Promise<void>;
  deleteArticle: (req: Request, res: Response) => Promise<void>;
  likeArticle: (req: Request, res: Response) => Promise<void>;
  unlikeArticle: (req: Request, res: Response) => Promise<void>;
  getMyArticles: (req: Request, res: Response) => Promise<void>;
  getMyFavoriteArticles: (req: Request, res: Response) => Promise<void>;
}

export interface IAuthController extends IBaseController {
  signUp: (req: Request, res: Response) => Promise<void>;
  login: (req: Request, res: Response) => Promise<void>;
  logout: (req: Request, res: Response) => Promise<void>;
  reissueTokens: (req: Request, res: Response) => Promise<void>;
  setTokenCookies: (
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  clearTokenCookies: (res: Response) => Promise<void>;
}

export interface ICommentController extends IBaseController {
  createProductComment: (req: Request, res: Response) => Promise<void>;
  createArticleComment: (req: Request, res: Response) => Promise<void>;
  updateComment: (req: Request, res: Response) => Promise<void>;
  deleteComment: (req: Request, res: Response) => Promise<void>;
  getProductComments: (req: Request, res: Response) => Promise<void>;
  getArticleComments: (req: Request, res: Response) => Promise<void>;
}

export interface IImageController extends IBaseController {}

export interface IProductController extends IBaseController {
  uploadProduct: (req: Request, res: Response) => Promise<void>;
  getAllProducts: (req: Request, res: Response) => Promise<void>;
  getProductDetail: (req: Request, res: Response) => Promise<void>;
  updateProduct: (req: Request, res: Response) => Promise<void>;
  deleteProduct: (req: Request, res: Response) => Promise<void>;
  favoriteProduct: (req: Request, res: Response) => Promise<void>;
  unfavoriteProduct: (req: Request, res: Response) => Promise<void>;
  getMyProducts: (req: Request, res: Response) => Promise<void>;
}

export interface IUserController extends IBaseController {
  getMyInfo: (req: Request, res: Response) => Promise<void>;
  updateMyInfo: (req: Request, res: Response) => Promise<void>;
  changeMyPassword: (req: Request, res: Response) => Promise<void>;
}

export interface INotificationController extends IBaseController {
  list: (req: Request, res: Response) => Promise<void>;
  unreadCount: (req: Request, res: Response) => Promise<void>;
  markRead: (req: Request, res: Response) => Promise<void>;
  markAllRead: (req: Request, res: Response) => Promise<void>;
}
