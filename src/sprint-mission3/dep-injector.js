import { PrismaClient } from "@prisma/client";
import { Server } from "./01-app/server.js";
import { ProductController } from "./02-controller/product.controller.js";
import { ProductService } from "./03-domain/service/product.service.js";
import { ProductRepo } from "./04-repo/product.repo.js";
import { ArticleService } from "./03-domain/service/article.service.js";
import { ArticleRepo } from "./04-repo/article.repo.js";
import { ArticleController } from "./02-controller/article.controller.js";
import { CommentRepo } from "./04-repo/comment.repo.js";
import { CommentService } from "./03-domain/service/comment.service.js";
import { CommentController } from "./02-controller/comment.controller.js";
import { ImageController } from "./02-controller/image.controller.js";
import { FileUploader } from "./common/util/file-uploader.js";
import { ProductRouter } from "./01-app/router/product.router.js";
import { ArticleRouter } from "./01-app/router/article.router.js";
import { CommentRouter } from "./01-app/router/comment.router.js";
import { ImageRouter } from "./01-app/router/image.router.js";

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
    const fileUploader = new FileUploader();
    const libs = { fileUploader };

    const productRepo = new ProductRepo(prisma);
    const articleRepo = new ArticleRepo(prisma);
    const commentRepo = new CommentRepo(prisma);

    const productService = new ProductService(productRepo);
    const articleService = new ArticleService(articleRepo);
    const commentService = new CommentService(commentRepo);

    const productController = new ProductController(productService);
    const articleController = new ArticleController(articleService);
    const commentController = new CommentController(commentService);
    const imageController = new ImageController();

    const productRouter = new ProductRouter(productController);
    const articleRouter = new ArticleRouter(articleController);
    const commentRouter = new CommentRouter(commentController);
    const imageRouter = new ImageRouter({ libs, imageController });
    const routers = [productRouter, articleRouter, commentRouter, imageRouter];
    return new Server(routers);
  }
}
