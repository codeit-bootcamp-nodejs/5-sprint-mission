import { PrismaClient } from "@prisma/client";
import { Server } from "./sprint-mission3/01-app/server.js";
import { ProductService } from "./sprint-mission3/03-domain/service/product.service.js";
import { ProductRepo } from "./sprint-mission3/04-repo/product.repo.js";
import { ArticleService } from "./sprint-mission3/03-domain/service/article.service.js";
import { ArticleRepo } from "./sprint-mission3/04-repo/article.repo.js";
import { CommentRepo } from "./sprint-mission3/04-repo/comment.repo.js";
import { CommentService } from "./sprint-mission3/03-domain/service/comment.service.js";
import { FileUploader } from "./sprint-mission3/common/util/file-uploader.js";
import { ProductController } from "./sprint-mission3/02-controller/product.controller.js";
import { ArticleController } from "./sprint-mission3/02-controller/article.controller.js";
import { CommentController } from "./sprint-mission3/02-controller/comment.controller.js";
import { ImageController } from "./sprint-mission3/02-controller/image.controller.js";
import { ImageRouter } from "./sprint-mission3/01-app/router/image.router.js";
import { CommentRouter } from "./sprint-mission3/01-app/router/comment.router.js";
import { ArticleRouter } from "./sprint-mission3/01-app/router/article.router.js";
import { ProductRouter } from "./sprint-mission3/01-app/router/product.router.js";

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

    const routers = [
      productRouter,
      articleRouter,
      commentRouter,
      imageRouter,
    ];

    return new Server(routers);
  }
}
