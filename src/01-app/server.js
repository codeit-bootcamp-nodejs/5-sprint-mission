import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import articlesRoutes from "../04-routes/articles.routes.js";
import commentsRoutes from "../04-routes/comments.routes.js";
import productsRoutes from "../04-routes/products.routes.js";

import { notFound } from "../05-middleware/notfound.middleware.js";
import { errorHandler } from "../05-middleware/error.middleware.js";

const app = express();

const origin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim());
app.use(cors({ origin: origin || true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "..", "uploads")));

app.use("/api", productsRoutes);
app.use("/api", articlesRoutes);
app.use("/api", commentsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 실행 중입니다: http://localhost:${PORT}`);
});
