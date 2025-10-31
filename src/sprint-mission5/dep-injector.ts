import { Server } from "./01-app/server";

export class DepInjector {
  private _sever: Server;

  constructor() {
    this._sever = this.injectDeps();
  }

  get server() {
    return this._sever;
  }

  injectDeps() {
    // const prisma = new PrismaClient();

    

   

    // const userController = new UserController(services);
    // const productController = new ProductController(services);
    // const productCommentController = new ProductCommentController(services);
    // const productLikeController = new ProductLikeController(services);
    // const articleController = new ArticleController(services);
    // const articleCommentController = new ArticleCommentController(services);
    // const articleLikeController = new ArticleLikeController(services);
    // const imageController = new ImageController();
    // const controllers = {
    //   user: userController,
    //   product: productController,
    //   productComment: productCommentController,
    //   productLike: productLikeController,
    //   article: articleController,
    //   articleComment: articleCommentController,
    //   articleLike: articleLikeController,
    //   image: imageController,
    // };

    // const userRouter = new UserRouter(controllers, managers);
    // const productRouter = new ProductRouter(controllers, managers);
    // const articleRouter = new ArticleRouter(controllers, managers);
    // const imageRouter = new ImageRouter(controllers, managers);
    // const routers = [userRouter, productRouter, articleRouter, imageRouter];

    return new Server();
  }
}
