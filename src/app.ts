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
import notificationRoute from "./routes/notification.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.send("ok"));

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/articles", articlesRouter);
app.use("/products/:productId/comments", productCommentsRouter);
app.use("/articles/:articleId/comments", articleCommentsRouter);
app.use("/users", usersRouter);
app.use("/notifications", notificationRoute);

app.use(errorHandler);

export default app;
