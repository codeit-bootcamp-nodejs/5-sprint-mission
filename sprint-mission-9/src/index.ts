import express, { Express } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import productRoutes from "./routes/products";
import articleRoutes from "./routes/articles";
import commentRoutes from "./routes/comments";
import notificationRoutes from "./routes/notification";
import errorHandler from "./middlewares/error.handler";

import { WSServer } from "./ws.server";
import http, { Server as HttpServer } from "http";

dotenv.config();

const app: Express = express();
const server: HttpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

const uploadDir = path.join(__dirname, "../src/uploads");
app.use("/api/uploads", express.static(uploadDir));

const wsServer = new WSServer(server);
wsServer.start();

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트로 실행되었습니다.`);
});
