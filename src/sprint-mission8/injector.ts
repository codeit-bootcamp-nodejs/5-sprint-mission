import { PrismaClient } from "@prisma/client";
import { ArticleRouter } from "./inbound/routers/article.router";
import { ImageRouter } from "./inbound/routers/image.router";
import { ProductRouter } from "./inbound/routers/product.router";
import { UserRouter } from "./inbound/routers/user.router";
import { ConfigUtil } from "./shared/util/config.util";
import { FileUtil } from "./shared/util/file.util";
import { TokenUtil } from "./shared/util/token.util";
import { Utils } from "./shared/util";
import { UserRepo } from "./outbound/repos/user.repo";
import { ProductRepo } from "./outbound/repos/product/product.repo";
import { ArticleRepo } from "./outbound/repos/article/article.repo";
import { ProductCommentRepo } from "./outbound/repos/product/product-comment.repo";
import { Repos } from "./outbound/repos";
import { UserService } from "./domain/service/user.service";
import { ArticleService } from "./domain/service/article/article.service";
import { AuthService } from "./domain/service/auth.service";
import { ProductService } from "./domain/service/product/product.service";
import { Services } from "./domain/services";
import { ArticleCommentService } from "./domain/service/article/article-comment.service";
import { ProductCommentService } from "./domain/service/product/product-comment.service";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash.manager";
import { Managers } from "./outbound/managers";
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
import { Controllers } from "./inbound/controllers";
import { Routers } from "./inbound/routers";
import { HttpServer } from "./inbound/servers/http-server";
import { WsServer } from "./inbound/servers/ws-server";

export class Injector {
  public readonly httpSever: HttpServer;
  public readonly wsServer: WsServer;
  constructor() {
    const {httpServer, wsServer} = this.inject();
    this.httpSever = httpServer;
    this.wsServer = wsServer;
  }

  inject() {
    const prisma = new PrismaClient();

    const configUtil = new ConfigUtil();
    const fileUtil = new FileUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const utils = new Utils(
      configUtil,
      fileUtil,
      tokenUtil
    );

    const hashManager = new BcryptHashManager(configUtil);
    const managers = new Managers(hashManager);

    const userRepo = new UserRepo(prisma);
    const productRepo = new ProductRepo(prisma);
    const productCommentRepo = new ProductCommentRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const articleCommentRepo = new ArticleCommentRepo(prisma);
    const tagRepo = new TagRepo(prisma);
    const userLikesProductRepo = new UserLikesProductRepo(prisma);
    const userLikesArticleRepo = new UserLikesArticleRepo(prisma);
    const repos = new Repos(
      userRepo,
      articleRepo,
      articleCommentRepo,
      productRepo,
      productCommentRepo,
      tagRepo,
      userLikesProductRepo,
      userLikesArticleRepo,
    );

    const userService = new UserService(repos, managers, utils);
    const authService = new AuthService(repos, managers, utils);
    const articleService = new ArticleService(repos, managers, utils);
    const articleCommentService = new ArticleCommentService(repos, managers, utils);
    const productService = new ProductService(repos, managers, utils);
    const productCommentService = new ProductCommentService(repos, managers, utils);
    const services = new Services(
      userService,
      authService,
      articleService,
      articleCommentService,
      productService,
      productCommentService,
    );

    const userController = new UserController(services);
    const productController = new ProductController(services);
    const productCommentController = new ProductCommentController(services);
    const productLikeController = new ProductLikeController(services);
    const articleController = new ArticleController(services);
    const articleCommentController = new ArticleCommentController(services);
    const articleLikeController = new ArticleLikeController(services);
    const imageController = new ImageController();
    const controllers = new Controllers (
      userController,
      productController,
      productCommentController,
      productLikeController,
      articleController,
      articleCommentController,
      articleLikeController,
      imageController,
    );

    const userRouter = new UserRouter(controllers, utils);
    const productRouter = new ProductRouter(controllers, utils);
    const articleRouter = new ArticleRouter(controllers, utils);
    const imageRouter = new ImageRouter(controllers, utils);
    const routers = new Routers(
      userRouter,
      productRouter,
      articleRouter,
      imageRouter
    );
    
    const httpServer = new HttpServer(routers, utils);
    const wsServer = new WsServer();
    
    return {
      httpServer,
      wsServer,
    };
  }
}
