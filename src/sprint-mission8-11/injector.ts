import { PrismaClient } from "@prisma/client";
import { ArticleRouter } from "./inbound/routers/article.router";
import { ImageRouter } from "./inbound/routers/image.router";
import { ProductRouter } from "./inbound/routers/product.router";
import { UserRouter } from "./inbound/routers/user.router";
import { ConfigUtil } from "./shared/utils/config.util";
import { ITokenUtil, TokenUtil } from "./shared/utils/token.util";
import { UserCommandService } from "./application/command/service/user.command.service";
import { ArticleCommandService } from "./application/command/service/article/article.command.service";
import { AuthCommandService } from "./application/command/service/auth.command.service";
import { ProductCommandService } from "./application/command/service/product/product.command.service";
import { ArticleCommentService } from "./application/command/service/article/article-comment.command.service";
import { ProductCommentCommandService } from "./application/command/service/product/product-comment.command.service";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash.manager";
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
import { EventBusUtil } from "./shared/utils/event-bus.util";
import { NotificationCommandService } from "./application/command/service/notification.command.service";
import { NotificationController } from "./inbound/controllers/notification.controller";
import { NotificationRouter } from "./inbound/routers/notification.router";
import { AuthMiddleware } from "./inbound/middlewares/auth.middleware";
import { CorsMiddleware } from "./inbound/middlewares/cors.middleware";
import { JsonMiddleware } from "./inbound/middlewares/json.middleware";
import { LoggerMiddleware } from "./inbound/middlewares/logger.middleware";
import { MulterMiddleware } from "./inbound/middlewares/multer.middleware";
import { NotFoundErrorMiddleware } from "./inbound/middlewares/not-found-error.middleware";
import { GlobalErrorMiddleware } from "./inbound/middlewares/global-error.middleware";
import { ArticleCommentCommandRepo } from "./outbound/repos/command/article/article-comment.command.repo";
import { ArticleCommandRepo } from "./outbound/repos/command/article/article.command.repo";
import { UserLikesArticleCommandRepo } from "./outbound/repos/command/like/user-likes-article.command.repo";
import { UserLikesProductCommandRepo } from "./outbound/repos/command/like/user-likes-product.command.repo";
import { NotificationCommandRepo } from "./outbound/repos/command/notification.command.repo";
import { ProductCommentCommandRepo } from "./outbound/repos/command/product/product-comment.command.repo";
import { ProductCommandRepo } from "./outbound/repos/command/product/product.command.repo";
import { TagCommandRepo } from "./outbound/repos/command/tag.command.repo";
import { UserCommandRepo } from "./outbound/repos/command/user.command.repo";
import { UserQueryService } from "./application/query/services/user.query.service";
import { UserQueryRepo } from "./outbound/repos/query/user.query.repo";
import { ProductQueryRepo } from "./outbound/repos/query/product.query.repo";
import { ArticleQueryRepo } from "./outbound/repos/query/article.query.repo";

export class Injector {
  public readonly httpServer: HttpServer;
  public readonly wsServer: WsServer;
  constructor(mockPrismaClient?: PrismaClient, testTokenUtil?: ITokenUtil) {
    const { httpServer, wsServer } = this.inject(
      mockPrismaClient,
      testTokenUtil,
    );
    this.httpServer = httpServer;
    this.wsServer = wsServer;
  }

  inject(testPrismaClient?: PrismaClient, testTokenUtil?: ITokenUtil) {
    const prisma = testPrismaClient ?? new PrismaClient();

    const configUtil = new ConfigUtil();
    const tokenUtil = testTokenUtil ?? new TokenUtil(configUtil);
    const eventBusUtil = new EventBusUtil();

    const authMiddleware = new AuthMiddleware(tokenUtil);
    const corsMiddleware = new CorsMiddleware(configUtil);
    const jsonMiddleware = new JsonMiddleware(configUtil);
    const loggerMiddleware = new LoggerMiddleware(configUtil);
    const multerMiddleware = new MulterMiddleware(configUtil);
    const notFoundErrorMiddleware = new NotFoundErrorMiddleware();
    const globalErrorMiddleware = new GlobalErrorMiddleware(configUtil);

    const hashManager = new BcryptHashManager(configUtil);

    const userCommandRepo = new UserCommandRepo(prisma);
    const userQueryRepo = new UserQueryRepo(prisma);
    const productCommandRepo = new ProductCommandRepo(prisma);
    const productQueryRepo = new ProductQueryRepo(prisma);
    const productCommentRepo = new ProductCommentCommandRepo(prisma);
    const articleCommandRepo = new ArticleCommandRepo(prisma);
    const articleQueryRepo = new ArticleQueryRepo(prisma);
    const articleCommentRepo = new ArticleCommentCommandRepo(prisma);
    const tagRepo = new TagCommandRepo(prisma);
    const userLikesProductRepo = new UserLikesProductCommandRepo(prisma);
    const userLikesArticleRepo = new UserLikesArticleCommandRepo(prisma);
    const notificationRepo = new NotificationCommandRepo(prisma);

    const userCommandService = new UserCommandService(
      userCommandRepo,
      hashManager,
    );
    const userQueryService = new UserQueryService(
      userQueryRepo,
      articleQueryRepo,
      productQueryRepo
    );
    const authService = new AuthCommandService(userCommandRepo, hashManager, tokenUtil);
    const articleService = new ArticleCommandService(
      articleCommandRepo,
      userLikesArticleRepo,
    );
    const articleCommentService = new ArticleCommentService(
      articleCommentRepo,
      notificationRepo,
      eventBusUtil,
    );
    const productService = new ProductCommandService(
      productCommandRepo,
      userLikesProductRepo,
      tagRepo,
      notificationRepo,
      eventBusUtil,
    );
    const productCommentService = new ProductCommentCommandService(
      productCommentRepo,
      notificationRepo,
      eventBusUtil,
    );
    const notificationService = new NotificationCommandService(notificationRepo);

    const userController = new UserController(authService, userCommandService, userQueryService);
    const productController = new ProductController(productService);
    const productCommentController = new ProductCommentController(
      productCommentService,
    );
    const productLikeController = new ProductLikeController(productService);
    const articleController = new ArticleController(articleService);
    const articleCommentController = new ArticleCommentController(
      articleCommentService,
    );
    const articleLikeController = new ArticleLikeController(articleService);
    const imageController = new ImageController();
    const notificationController = new NotificationController(
      notificationService,
    );

    const userRouter = new UserRouter(authMiddleware, userController);
    const productRouter = new ProductRouter(
      authMiddleware,
      productController,
      productCommentController,
      productLikeController,
    );
    const articleRouter = new ArticleRouter(
      authMiddleware,
      articleController,
      articleCommentController,
      articleLikeController,
    );
    const imageRouter = new ImageRouter(
      authMiddleware,
      imageController,
      multerMiddleware,
    );
    const notificationRouter = new NotificationRouter(
      authMiddleware,
      notificationController,
    );

    const notificationGateway = new NotificationGateway(
      authMiddleware,
      eventBusUtil,
      configUtil,
    );

    const httpServer = new HttpServer(
      userRouter,
      productRouter,
      articleRouter,
      imageRouter,
      notificationRouter,
      configUtil,
      globalErrorMiddleware,
      corsMiddleware,
      jsonMiddleware,
      loggerMiddleware,
      notFoundErrorMiddleware,
    );
    const wsServer = new WsServer(
      httpServer.defaultHttpServer,
      notificationGateway,
      configUtil,
    );

    return {
      httpServer,
      wsServer,
    };
  }
}
