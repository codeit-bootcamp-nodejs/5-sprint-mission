import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Exception } from "../common/exception.js";

export class Server {
  #server;
  #routers;
  constructor(routers) {
    this.#routers = routers;
    this.#server = express();
  }

  listen = () => {
    this.#server.listen(process.env.PORT, () => {
      console.log(`app server listening on port ${process.env.PORT}`);
    });
  };

  registerBaseMiddlewares = () => {
    this.#server.use(cors());
    this.#server.use(morgan("dev"));
    this.#server.use(express.json());
  };

  registerExceptionMiddleware = () => {
    this.#server.use((err, req, res, next) => {
      if (err instanceof Exception) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: "알 수 없는 에러 발생!!!" });
        console.error(err);
      }
    });
  };

  registerControllerMiddleware = () => {
    for (const router of this.#routers) {
      this.#server.use(router.basePath, router.router);
    }
  };
  start = () => {
    this.registerBaseMiddlewares();
    this.registerControllerMiddleware();
    this.registerExceptionMiddleware();
    this.listen();
  };
}
