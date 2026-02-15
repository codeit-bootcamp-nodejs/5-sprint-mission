import express, { Express } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import http, { Server as HttpServer } from "http";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
import articleRoutes from "./routes/articles";
import commentRoutes from "./routes/comments";
import notificationRoutes from "./routes/notification";
import errorHandler from "./middlewares/error.handler";
import { WSServer } from "./ws.server";

dotenv.config();

export class Backend {
  public app: Express;
  public server: HttpServer;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.middlewares();
    this.routes();
    this.wsSocket();
    this.finalErrorHandler();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());

    const uploadDir = path.join(__dirname, "../src/uploads");
    this.app.use("/api/uploads", express.static(uploadDir));
  }

  private routes(): void {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/users", userRoutes);
    this.app.use("/api/products", productRoutes);
    this.app.use("/api/articles", articleRoutes);
    this.app.use("/api/comments", commentRoutes);
    this.app.use("/api/notifications", notificationRoutes);
  }

  private wsSocket(): void {
    const wsServer = new WSServer(this.server);
    wsServer.start();
  }

  private finalErrorHandler(): void {
    this.app.use(errorHandler);
  }

  run() {
    const PORT = process.env.PORT || 3000;
    this.server.listen(PORT, () => {
      console.log(`서버가 ${PORT}번 포트로 실행되었습니다.`);
    });
  }
}

const backend = new Backend();

export const app = backend.app;
export const server = backend.server;

export default backend;
