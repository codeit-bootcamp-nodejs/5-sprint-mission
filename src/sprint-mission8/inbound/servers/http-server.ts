import express, { Application, NextFunction, Request, Response } from "express";
import http, { Server as DefaultHttpServer } from "http";
import cors from "cors";
import morgan from "morgan";
import { Routers } from "../routers";
import { IUtils } from "../../shared/util";
import { Exception } from "../../shared/exception/exception";

export class HttpServer {
  public readonly app: Application;
  public readonly defaultHttpServer: DefaultHttpServer;

  constructor(
    public readonly routers: Routers,
    public readonly utils: IUtils
  ) {
    this.app = express();
    this.defaultHttpServer = http.createServer(this.app);
  }

  listen = () => {
    this.app.listen(this.utils.config.getParsed().PORT, () => {
      console.log(
        `app server listening on port ${this.utils.config.getParsed().PORT}`,
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
    this.app.use(
      this.routers.article.basePath,
      this.routers.article.router,
    );
    this.app.use(this.routers.product.basePath, this.routers.product.router);
    this.app.use(this.routers.user.basePath, this.routers.user.router);
    this.app.use(this.routers.image.basePath, this.routers.image.router);
    this.app.use((req, res, next) => {
      next(new Error("경로가 없습니다."));
    });
    this.registerExceptionMiddleware();
    this.listen();
  };
}
