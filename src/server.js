import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";

import authRouter from "./routes/auth.route.js";
import usersRouter from "./routes/users.route.js";
import productsRouter from "./routes/products.route.js";
import articlesRouter from "./routes/articles.route.js";
import productCommentsRouter from "./routes/productComments.route.js";
import articleCommentsRouter from "./routes/articleComments.route.js";

import { errorHandler, notFoundHandler } from "./middlewares/error.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/products/:productId/comments", productCommentsRouter);
app.use("/api/articles/:articleId/comments", articleCommentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
