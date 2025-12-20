import { PrismaClient } from "@prisma/client";
import { ArticleRouter } from "./inbound/routers/article.router";
import { ImageRouter } from "./inbound/routers/image.router";
import { ProductRouter } from "./inbound/routers/product.router";
import { UserRouter } from "./inbound/routers/user.router";
import { ConfigUtil } from "./shared/util/config.util";
import { FileUtil } from "./shared/util/file.util";
import { TokenUtil } from "./shared/util/token.util";
import { UserRepo } from "./outbound/repos/user.repo";
import { ProductRepo } from "./outbound/repos/product/product.repo";
import { ArticleRepo } from "./outbound/repos/article/article.repo";
import { ProductCommentRepo } from "./outbound/repos/product/product-comment.repo";
import { UserService } from "./domain/service/user.service";
import { ArticleService } from "./domain/service/article/article.service";
import { AuthService } from "./domain/service/auth.service";
import { ProductService } from "./domain/service/product/product.service";
import { ArticleCommentService } from "./domain/service/article/article-comment.service";
import { ProductCommentService } from "./domain/service/product/product-comment.service";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash.manager";
import { UserLikesProductRepo } from "./outbound/repos/like/user-likes-product.repo";
import { UserLikesArticleRepo } from "./outbound/repos/like/user-likes-article.repo";
import { TagRepo } from "./outbound/repos/tag.repo";
import { ArticleCommentRepo } from "./outbound/repos/article/article-comment.repo";
import { UserController } from "./inbound/controllers/user.controller";
import { ProductController } from "./inbound/controllers/product.controller";
import { ProductCommentController } from "./inbound/controllers/product.comment.controller";
import { ProductLikeController } from "./inbound/controllers/product.like.controller";
import { ArticleController } from "./inbound/controllers/article.controller";
import { ArticleCommentController } from "./inbound/controllers/article.comment.controller";
import { ArticleLikeController } from "./inbound/controllers/article.like.controller";
import { ImageController } from "./inbound/controllers/image.controller";
import { HttpServer } from "./inbound/servers/http-server";
import { WsServer } from "./inbound/servers/ws-server";
import { NotificationGateway } from "./inbound/gataways/notification.gateway";
import { NotificationRepo } from "./outbound/repos/notification.repo";
import { EventBusUtil } from "./shared/util/event-bus.util";
import { NotificationService } from "./domain/service/notification.service";
import { NotificationController } from "./inbound/controllers/notification.controller";
import { NotificationRouter } from "./inbound/routers/notification.router";
import { AuthMiddleware } from "./inbound/middlewares/auth.middleware";

export class Injector {
  public readonly httpSever: HttpServer;
  public readonly wsServer: WsServer;
  constructor() {
    const { httpServer, wsServer } = this.inject();
    this.httpSever = httpServer;
    this.wsServer = wsServer;
  }

  inject() {
    const prisma = new PrismaClient();

    const configUtil = new ConfigUtil();
    const fileUtil = new FileUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const eventBusUtil = new EventBusUtil();

    const authMiddleware = new AuthMiddleware(tokenUtil);

    const hashManager = new BcryptHashManager(configUtil);

    const userRepo = new UserRepo(prisma);
    const productRepo = new ProductRepo(prisma);
    const productCommentRepo = new ProductCommentRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const articleCommentRepo = new ArticleCommentRepo(prisma);
    const tagRepo = new TagRepo(prisma);
    const userLikesProductRepo = new UserLikesProductRepo(prisma);
    const userLikesArticleRepo = new UserLikesArticleRepo(prisma);
    const notificationRepo = new NotificationRepo(prisma);

    const userService = new UserService(userRepo, productRepo, articleRepo, hashManager);
    const authService = new AuthService(userRepo, hashManager, tokenUtil);
    const articleService = new ArticleService(articleRepo, userLikesArticleRepo);
    const articleCommentService = new ArticleCommentService(articleCommentRepo, notificationRepo, eventBusUtil);
    const productService = new ProductService(productRepo, userLikesProductRepo, tagRepo, notificationRepo, eventBusUtil);
    const productCommentService = new ProductCommentService(productCommentRepo, notificationRepo, eventBusUtil);
    const notificationService = new NotificationService(notificationRepo)

    const userController = new UserController(authService, userService);
    const productController = new ProductController(productService);
    const productCommentController = new ProductCommentController(productCommentService);
    const productLikeController = new ProductLikeController(productService);
    const articleController = new ArticleController(articleService);
    const articleCommentController = new ArticleCommentController(articleCommentService);
    const articleLikeController = new ArticleLikeController(articleService);
    const imageController = new ImageController();
    const notificationController = new NotificationController(notificationService);

    const userRouter = new UserRouter(authMiddleware, userController);
    const productRouter = new ProductRouter(authMiddleware, productController, productCommentController, productLikeController);
    const articleRouter = new ArticleRouter(authMiddleware, articleController, articleCommentController, articleLikeController);
    const imageRouter = new ImageRouter(authMiddleware, imageController, fileUtil);
    const notificationRouter = new NotificationRouter(authMiddleware, notificationController)

    const notificationGateway = new NotificationGateway(authMiddleware, eventBusUtil, configUtil);

    const httpServer = new HttpServer(
      userRouter,
      productRouter,
      articleRouter,
      imageRouter,
      notificationRouter,
      configUtil,
    );
    const wsServer = new WsServer(httpServer.defaultHttpServer, notificationGateway, configUtil);

    return {
      httpServer,
      wsServer,
    };
  }
}
