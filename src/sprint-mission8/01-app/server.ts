import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { ConfigManager } from "../shared/util/config.manager";
import { IManagers } from "../shared/util/managers";
import { Exception } from "../shared/exception/exception";
import { UserRouter } from "./router/user.router";
import { ProductRouter } from "./router/product.router";
import { ArticleRouter } from "./router/article.router";
import { ImageRouter } from "./router/image.router";

const configManager = new ConfigManager();

export class Server {
  private _server;
  private _routers;
  private _configManager;

  constructor({ routers, managers }: {
    routers: (UserRouter | ProductRouter | ArticleRouter | ImageRouter)[];
    managers: IManagers;
  }) {
    this._routers = routers;
    this._server = express();
    this._configManager = managers.config;
  }

  listen = () => {
    this._server.listen(this._configManager.getParsed().PORT, () => {
      console.log(
        `app server listening on port ${this._configManager.getParsed().PORT}`,
      );
    });
  };

  registerBaseMiddlewares = () => {
    const whitelist = ["http://localhost:3000"];
    this._server.use(
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
    this._server.use(morgan("dev"));
    this._server.use(express.json());
  };

  registerExceptionMiddleware = () => {
    this._server.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof Exception) {
        res.status(err.statusCode).json({ message: err.message });
        console.error(err);
      } else {
        res.status(500).json({ message: "알 수 없는 에러 발생!!!" });
        console.error(err);
      }
    });
  };

  registerRouterMiddleware = () => {
    for (const router of this._routers) {
      this._server.use(router.basePath, router.router);
    }
  };
  start = () => {
    this.registerBaseMiddlewares();
    this.registerRouterMiddleware();
    this._server.use((req, res, next) => {
      next(new Error("경로가 없습니다."));
    });
    this.registerExceptionMiddleware();
    this.listen();
  };
}
