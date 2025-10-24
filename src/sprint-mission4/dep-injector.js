import { PrismaClient } from "@prisma/client";
import { Server } from "./01-app/server.js";
import { ProductService } from "../sprint-mission4/03-domain/service/product.service.js";
import { ProductRepo } from "./04-repo/product.repo.js";
import { ArticleService } from "./03-domain/service/article.service.js";
import { ArticleRepo } from "./04-repo/article.repo.js";
import { CommentRepo } from "./04-repo/comment.repo.js";
import { CommentService } from "./03-domain/service/comment.service.js";
import { ProductController } from "./02-controller/product.controller.js";
import { ArticleController } from "./02-controller/article.controller.js";
import { ProductCommentController } from "./02-controller/product.comment.controller.js";
import { ImageController } from "./02-controller/image.controller.js";
import { ImageRouter } from "./01-app/router/image.router.js";
import { CommentRouter } from "./01-app/router/comment.router.js";
import { ArticleRouter } from "./01-app/router/article.router.js";
import { ProductRouter } from "./01-app/router/product.router.js";
import { ConfigManager } from "./common/util/config.manager.js";
import { FileManager } from "./common/util/file.manager.js";
import { ArticleCommentController } from "./02-controller/article.comment.controller.js";
import { UserRouter } from "./01-app/router/user.router.js";
import { UserController } from "./02-controller/user.controller.js";
import { UserRepo } from "./04-repo/user.repo.js";
import { UserService } from "./03-domain/service/user.service.js";
import { HashManager } from "./common/util/hash.manager.js";
import { TokenManager } from "./common/util/token.manager.js";
import { AuthService } from "./03-domain/service/auth.service.js";

export class DepInjector {
  #sever;

  constructor() {
    this.#sever = this.injectDeps();
  }

  get server() {
    return this.#sever;
  }

  injectDeps() {
    const prisma = new PrismaClient();

    const hashManager = new HashManager();
    const configManager = new ConfigManager();
    const fileManager = new FileManager();
    const tokenManager = new TokenManager(configManager);
    const managers = {
      file: fileManager,
      config: configManager,
      hash: hashManager,
      token: tokenManager,
    };

    const userRepo = new UserRepo(prisma);
    const productRepo = new ProductRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const commentRepo = new CommentRepo(prisma);
    const repos = {
      user: userRepo,
      product: productRepo,
      article: articleRepo,
      comment: commentRepo,
    };

    const userService = new UserService(repos, managers);
    const productService = new ProductService(repos);
    const articleService = new ArticleService(repos);
    const commentService = new CommentService(repos);
    const authService = new AuthService(repos, managers);
    const services = {
      user: userService,
      product: productService,
      article: articleService,
      comment: commentService,
      auth: authService,
    };

    const userController = new UserController(services);
    const productController = new ProductController(services);
    const articleController = new ArticleController(services);
    const articleCommentController = new ArticleCommentController(services);
    const productCommentController = new ProductCommentController(services);
    const imageController = new ImageController();
    const controllers = {
      user: userController,
      product: productController,
      article: articleController,
      productComment: productCommentController,
      articleComment: articleCommentController,
      image: imageController,
    };

    const userRouter = new UserRouter(controllers, managers);
    const productRouter = new ProductRouter(controllers, managers);
    const articleRouter = new ArticleRouter(controllers, managers);
    const commentRouter = new CommentRouter(controllers, managers);
    const imageRouter = new ImageRouter(controllers, managers);
    const routers = [
      userRouter,
      productRouter,
      articleRouter,
      commentRouter,
      imageRouter,
    ];

    return new Server({ routers, managers });
  }
}
