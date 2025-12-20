import express, { Application, NextFunction, Request, Response } from "express";
import http, { Server as DefaultHttpServer } from "http";
import cors from "cors";
import morgan from "morgan";
import { Exception } from "../../shared/exception/exception";
import { UserRouter } from "../routers/user.router";
import { IConfigUtil } from "../../shared/util/config.util";
import { ArticleRouter } from "../routers/article.router";
import { ImageRouter } from "../routers/image.router";
import { NotificationRouter } from "../routers/notification.router";
import { ProductRouter } from "../routers/product.router";

export class HttpServer {
  public readonly app: Application;
  public readonly defaultHttpServer: DefaultHttpServer;

  constructor(
    public readonly userRouter: UserRouter,
    public readonly productRouter: ProductRouter,
    public readonly articleRouter: ArticleRouter,
    public readonly imageRouter: ImageRouter,
    public readonly notificationRouter: NotificationRouter,
    public readonly configUtil: IConfigUtil,
  ) {
    this.app = express();
    this.defaultHttpServer = http.createServer(this.app);
  }

  listen = () => {
    this.defaultHttpServer.listen(this.configUtil.getParsed().PORT, () => {
      console.log(
        `app server listening on port ${this.configUtil.getParsed().PORT}`,
      );
    });
  };

  registerBaseMiddlewares = () => {
    const whitelist = ["http://localhost:3000"];
    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) {
            callback(null, true);
          } else {
            if (whitelist.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          }
        },
        credentials: true,
      }),
    );
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  };

  registerExceptionMiddleware = () => {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof Exception) {
        res.status(err.statusCode).json({ message: err.message });
        console.error(err);
      } else {
        res.status(500).json({ message: "알 수 없는 에러 발생!!!" });
        console.error(err);
      }
    });
  };

  start = () => {
    this.registerBaseMiddlewares();

    // router
    this.app.use(this.userRouter.basePath, this.userRouter.router);
    this.app.use(this.productRouter.basePath, this.productRouter.router);
    this.app.use(this.articleRouter.basePath, this.articleRouter.router,);
    this.app.use(this.imageRouter.basePath, this.imageRouter.router);
    this.app.use(this.notificationRouter.basePath, this.notificationRouter.router);
    this.registerExceptionMiddleware();
    this.app.use((req, res, next) => {
      if (req.headers.upgrade?.toLowerCase() === "websocket") return next();
      next(new Error("경로가 없습니다."));
    });
    this.listen();
  };
}
