import express, { Application } from "express";
import http, { Server as DefaultHttpServer } from "http";
import { UserRouter } from "../routers/user.router";
import { IConfigUtil } from "../../shared/utils/config.util";
import { ArticleRouter } from "../routers/article.router";
import { ImageRouter } from "../routers/image.router";
import { NotificationRouter } from "../routers/notification.router";
import { ProductRouter } from "../routers/product.router";
import { GlobalErrorMiddleware } from "../middlewares/global-error.middleware";
import { CorsMiddleware } from "../middlewares/cors.middleware";
import { JsonMiddleware } from "../middlewares/json.middleware";
import { LoggerMiddleware } from "../middlewares/logger.middleware";
import { NotFoundErrorMiddleware } from "../middlewares/not-found-error.middleware";
import { MulterMiddleware } from "../middlewares/multer.middleware";

export class HttpServer {
  public readonly app: Application;
  public readonly defaultHttpServer: DefaultHttpServer;

  constructor(
    // router
    public readonly userRouter: UserRouter,
    public readonly productRouter: ProductRouter,
    public readonly articleRouter: ArticleRouter,
    public readonly imageRouter: ImageRouter,
    public readonly notificationRouter: NotificationRouter,
    // util
    public readonly configUtil: IConfigUtil,
    // middleware
    public readonly globalErrorMiddleware: GlobalErrorMiddleware,
    public readonly corsMiddleware: CorsMiddleware,
    public readonly jsonMiddleware: JsonMiddleware,
    public readonly loggerMiddleware: LoggerMiddleware,
    public readonly notFoundErrorMiddleware: NotFoundErrorMiddleware,
  ) {
    this.app = express();
    this.defaultHttpServer = http.createServer(this.app);

    // middlewares
    this.app.use(this.loggerMiddleware.handler());
    this.app.use(this.corsMiddleware.handler());
    this.app.use(this.jsonMiddleware.handler());

    // router
    this.app.use(this.userRouter.basePath, this.userRouter.router);
    this.app.use(this.productRouter.basePath, this.productRouter.router);
    this.app.use(this.articleRouter.basePath, this.articleRouter.router);
    this.app.use(this.imageRouter.basePath, this.imageRouter.router);
    this.app.use(
      this.notificationRouter.basePath,
      this.notificationRouter.router,
    );

    // errors
    this.app.use(this.notFoundErrorMiddleware.handler());
    this.app.use(this.globalErrorMiddleware.handler());
  }

  listen = () => {
    this.defaultHttpServer.listen(this.configUtil.getParsed().PORT, () => {
      console.log(
        `app server listening on port ${this.configUtil.getParsed().PORT}`,
      );
    });
  };

  start = () => {
    this.listen();
  };
}
