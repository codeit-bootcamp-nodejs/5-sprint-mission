import { PrismaClient } from "@prisma/client";
import { Server } from "./sprint-mission3/01-app/server.js";
import { ProductController } from "./sprint-mission3/02-controller/product.controller.js";
import { ProductService } from "./sprint-mission3/03-domain/service/product.service.js";
import { ProductRepo } from "./sprint-mission3/04-repo/product.repo.js";
import { ProductMiddleware } from "./sprint-mission3/02-controller/midleware/product.middleware.js";
import { ArticleService } from "./sprint-mission3/03-domain/service/article.service.js";
import { ArticleRepo } from "./sprint-mission3/04-repo/article.repo.js";
import { ArticleController } from "./sprint-mission3/02-controller/article.controller.js";
import { ArticleMiddleware } from "./sprint-mission3/02-controller/midleware/article.middleware.js";
import { CommentRepo } from "./sprint-mission3/04-repo/comment.repo.js";
import { CommentService } from "./sprint-mission3/03-domain/service/comment.service.js";
import { CommentMiddleware } from "./sprint-mission3/02-controller/midleware/comment.middleware.js";
import { CommentController } from "./sprint-mission3/02-controller/comment.controller.js";

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
    
    const productRepo = new ProductRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const commentRepo = new CommentRepo(prisma);

    const productService = new ProductService(productRepo);
    const articleService = new ArticleService(articleRepo);
    const commentService = new CommentService(commentRepo);

    const productMiddleware = new ProductMiddleware(productService);
    const articleMiddleware = new ArticleMiddleware(articleService);
    const commentMiddleware = new CommentMiddleware(commentService)

    const productController = new ProductController(productMiddleware, commentMiddleware);
    const articleController = new ArticleController(articleMiddleware, commentMiddleware);
    const commentController = new CommentController(commentMiddleware);
    const controllers = [productController, articleController, commentController];

    return new Server(controllers);
  }
}
