import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { productRouter } from "./routes/product-route.js";
import { articleRouter } from "./routes/article-route.js";
import {
  productCommentRouter,
  articleCommentRouter,
} from "./routes/comment-route.js";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/products", productCommentRouter);
app.use("/articles", articleCommentRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
