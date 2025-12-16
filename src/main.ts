import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./common/config/constants";
import { initializeSocket } from "./common/lib/socket.manager";
import articlesRouterCA from "./inbound/routers/articles.router";
import userRouterCA from "./inbound/routers/user.router";
import imagesRouter from "./inbound/routers/images.router";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./inbound/controllers/error.controller";

const app = express();

app.use(cors());
app.use(express.json());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/articles", articlesRouterCA);
app.use("/users", userRouterCA);
app.use("/images", imagesRouter);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

const httpServer = http.createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
  console.log(`WebSocket 연결: ws://localhost:${PORT}`);
});
