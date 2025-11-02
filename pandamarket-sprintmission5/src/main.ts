import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import productRouter from "./routers/product-router";
import articleRouter from "./routers/article-router";
import commentRouter from "./routers/comment-router";
import uploadRouter from "./routers/upload-router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/images", uploadRouter);

app.use((err, req, res, next) => {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "development"
      ? err.message
      : "서버 오류가 발생했습니다";

  res.status(status).json({
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
