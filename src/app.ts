import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";

import { errorHandler, notFoundHandler } from "./middlewares/error";
import authRouter from "./routes/auth.route";
import usersRouter from "./routes/users.route";
import productsRouter from "./routes/products.route";
import articlesRouter from "./routes/articles.route";
import productCommentsRouter from "./routes/productComments.route";
import articleCommentsRouter from "./routes/articleComments.route";

dotenv.config();
export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/products/:productId/comments", productCommentsRouter);
app.use("/api/articles/:articleId/comments", articleCommentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
