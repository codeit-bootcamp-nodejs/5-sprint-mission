import express, { Express, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorMiddleware } from "../middelware/error";

type RouterMap = Record<string, { path: string; handler: Router }>;

export class Server {
  #server: Express;
  #routers: RouterMap;
  #config: Map<string, any>;

  constructor({ routers, config }: { routers: RouterMap; config: Map<string, any> }) {
    this.#routers = routers;
    this.#config = config;
    this.#server = express();
  }

  registerMiddlewares() {
    const whitelist = ["http://localhost:3000"];
    this.#server.use(cors({
      origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) callback(null, true);
        else callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }));

    this.#server.use(morgan("dev"));
    this.#server.use(express.json());
    this.#server.use(express.urlencoded({ extended: true }));
    this.#server.use("/uploads", express.static("uploads"));
  }

  registerRouters() {
    Object.values(this.#routers).forEach((router) => {
      this.#server.use(router.path, router.handler);
    });
  }

  registerErrorHandler() {
    this.#server.use(errorMiddleware);
  }

  listen() {
    const port = this.#config.get("PORT") as number;
    this.#server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  start() {
    this.registerMiddlewares();
    this.registerRouters();
    this.registerErrorHandler();
    this.listen();
  }
}
