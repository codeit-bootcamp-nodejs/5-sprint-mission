import express, { Express, Router } from "express";
import cors from "cors";
import morgan from "morgan";
import { errorMiddleware } from "../middleware/error";
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

type RouterMap = Record<string, { path: string; handler: Router }>;

export class Server {
  #server: Express;
  #httpServer!: HTTPServer;
  #io!: SocketIOServer;
  #routers: RouterMap;
  #config: Map<string, any>;

  constructor({
    routers,
    config,
  }: {
    routers: RouterMap;
    config: Map<string, any>;
  }) {
    this.#routers = routers;
    this.#config = config;
    this.#server = express();
  }

  registerMiddlewares() {
    const whitelist = ["http://localhost:3000"];
    this.#server.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || whitelist.includes(origin)) callback(null, true);
          else callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
      }),
    );

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
    this.#httpServer = new HTTPServer(this.#server);

    this.#io = new SocketIOServer(this.#httpServer, {
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true,
      },
    });

    this.#io.on("connection", (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    this.#httpServer.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }

  start() {
    this.registerMiddlewares();
    this.registerRouters();
    this.registerErrorHandler();
    this.listen();
  }

  get io() {
    return this.#io;
  }
}