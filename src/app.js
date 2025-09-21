import express from "express";
import cors from "cors";
import morgan from "morgan";
import productsRouter from "./routes/products.js";
import articlesRouter from "./routes/articles.js";
import productCommentsRouter from "./routes/productComments.js";
import articleCommentsRouter from "./routes/articleComments.js";
import imagesRouter from "./routes/images.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
      credentials: true,
    }),
  );
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(
    "/uploads",
    express.static(process.env.UPLOAD_DIR || "public/uploads"),
  );
  app.get("/health", (req, res) => res.status(200).json({ ok: true }));
  app.use("/api/products", productsRouter);
  app.use("/api/articles", articlesRouter);
  app.use("/api/products/:productId/comments", productCommentsRouter);
  app.use("/api/articles/:articleId/comments", articleCommentsRouter);
  app.use("/api/images", imagesRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
