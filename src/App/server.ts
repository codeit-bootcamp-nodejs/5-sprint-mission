import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import articlesRoutes from "../Routes/articles.routes";
import commentsRoutes from "../Routes/comments.routes";
import productsRoutes from "../Routes/products.routes";
import authRoutes from "../Routes/auth.routes";
import usersRoutes from "../Routes/users.routes";

import { notFound } from "../Middleware/notfound.middleware";
import { errorHandler } from "../Middleware/error.middleware";

const app = express();

const origin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim());
app.use(cors({ origin: origin || true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

app.use("/api", productsRoutes);
app.use("/api", articlesRoutes);
app.use("/api", commentsRoutes);
app.use("/api", authRoutes);
app.use("/api", usersRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
