import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config();
import productRoutes from "./routes/products.js";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/comments.js";
import errorHandler from "./middlewares/error.handler.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/comments", commentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트로 실행되었습니다.`);
});