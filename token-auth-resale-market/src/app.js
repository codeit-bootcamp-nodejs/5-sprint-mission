import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/comments.js";
import uploadRouter from "./routes/upload-router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRouter);

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

export default app;
