import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Exception } from "../common/const/exception.js";
import { CONFIG_KEY } from "../common/const/config.key.js";

export class Server {
  #server;
  #routers;
  #managers;

  constructor({ routers, managers }) {
    this.#routers = routers;
    this.#server = express();
    this.#managers = managers;
  }

  listen = () => {
    this.#server.listen(this.#managers.config.get(CONFIG_KEY.PORT), () => {
      console.log(
        `app server listening on port ${this.#managers.config.get(CONFIG_KEY.PORT)}`,
      );
    });
  };

  registerBaseMiddlewares = () => {
    const whitelist = ["http://localhost:3000"];
    this.#server.use(cors({
      origin: function (origin, callback) {
        if (!origin) {
          callback(null, true)
        } else {
          if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
          } else {
            callback(null, false)
          }
        }
      },
      credentials: true,
    }));
    this.#server.use(morgan("dev"));
    this.#server.use(express.json());
  };

  registerExceptionMiddleware = () => {
    this.#server.use((err, req, res, next) => {
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
    for (const router of this.#routers) {
      this.#server.use(router.basePath, router.router);
    }
  };
  start = () => {
    this.registerBaseMiddlewares();
    this.registerRouterMiddleware();
    this.#server.use((req, res, next) => {
      next(new Error("경로가 없습니다."));
    })
    this.registerExceptionMiddleware();
    this.listen();
  };
}
