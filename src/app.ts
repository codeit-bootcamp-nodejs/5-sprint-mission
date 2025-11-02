import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRouter from "./routes/auth.route";
import productsRouter from "./routes/products.route";
import articlesRouter from "./routes/articles.route";
import productCommentsRouter from "./routes/productComments.route";
import articleCommentsRouter from "./routes/articleComments.route";
import usersRouter from "./routes/users.route";

import { errorHandler } from "./middlewares/error";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.send("ok"));

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/products/:productId/comments", productCommentsRouter);
app.use("/api/articles/:articleId/comments", articleCommentsRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

export default app;
