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
import { CommentController } from "./02-controller/comment.controller.js";
import { ImageController } from "./02-controller/image.controller.js";
import { ImageRouter } from "./01-app/router/image.router.js";
import { CommentRouter } from "./01-app/router/comment.router.js";
import { ArticleRouter } from "./01-app/router/article.router.js";
import { ProductRouter } from "./01-app/router/product.router.js";
import { ConfigManager } from "./common/util/config.manager.js";
import { FileManager } from "./common/util/file.manager.js";

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

    const configManager = new ConfigManager();
    const fileManager = new FileManager();
    const managers = {
      file: fileManager,
      config: configManager,
    };

    const productRepo = new ProductRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const commentRepo = new CommentRepo(prisma);
    const repos = {
      product: productRepo,
      article: articleRepo,
      comment: commentRepo,
    }

    const productService = new ProductService(repos);
    const articleService = new ArticleService(repos);
    const commentService = new CommentService(repos);
    const services = {
      product: productService,
      article: articleService,
      comment: commentService,
    }

    const productController = new ProductController(services);
    const articleController = new ArticleController(services);
    const commentController = new CommentController(services);
    const imageController = new ImageController();
    const controllers = {
      product: productController,
      article: articleController,
      comment: commentController,
      image: imageController,
    }

    const productRouter = new ProductRouter(controllers);
    const articleRouter = new ArticleRouter(controllers);
    const commentRouter = new CommentRouter(controllers);
    const imageRouter = new ImageRouter({ managers, controllers });
    const routers = [
      productRouter,
      articleRouter,
      commentRouter,
      imageRouter,
    ];

    return new Server({routers, managers});
  }
}
