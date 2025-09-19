import express from "express";
import cors from 'cors';
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import {
  articleCommentRouter,
  commentRouter,
  productCommentRouter,
} from "./routes/comment.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);

app.use("/products/:productId/comments", productCommentRouter);
app.use("/articles/:articleId/comments", articleCommentRouter);
app.use("/comments", commentRouter);

app.use("/product", express.static("uploads/"));

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
