import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient, Prisma } from "@prisma/client";
import { Exception } from "../exception/exception.js";
import { errorHandler } from "./middleware/error.js";
import { upload } from "./middleware/upload.js";

const prisma = new PrismaClient();

export class Server {
  #controllers;
  #server;

  constructor(controllers = []) {
    this.#controllers = controllers;
    this.#server = express();
  }

  registerMiddleWare() {
    this.#server.use(cors());
    this.#server.use(morgan("dev"));
    this.#server.use(express.json());
    this.#server.use("/uploads", express.static("uploads")); // 업로드 파일 static 제공
  }

  registerRouters() {
    // 컨트롤러 기반 라우터
    for (const controller of this.#controllers) {
      this.#server.use(controller.basePath, controller.router);
    }

    this.#server.post("/products", async (req, res, next) => {
      try {
        const { name, description, price, tags } = req.body;
        if (!name || !description || !price) {
          return res
            .status(400)
            .json({ message: "상품 이름, 설명, 가격은 필수입니다." });
        }
        const product = await prisma.product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            tags: tags || [],
          },
        });
        res.status(201).json(product);
      } catch (err) {
        next(err);
      }
    });

    this.#server.post("/articles", async (req, res, next) => {
      try {
        const { title, content } = req.body;
        if (!title || !content) {
          return res
            .status(400)
            .json({ message: "게시물 제목과 내용은 필수입니다." });
        }
        const article = await prisma.article.create({
          data: { title, content },
        });
        res.status(201).json(article);
      } catch (err) {
        next(err);
      }
    });

    this.#server.post("/upload", upload.single("image"), (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({ message: "이미지를 업로드해야 합니다." });
      }
      res.status(200).json({
        message: "이미지 업로드 성공",
        filePath: `/uploads/${req.file.filename}`,
      });
    });
  }

  registerExceptionHandler() {
    this.#server.use((err, req, res, next) => {
      if (err instanceof Exception) {
        return res.status(err.statusCode).json({ message: err.message });
      }

      if (
        err.name === "StructError" ||
        err instanceof Prisma.PrismaClientValidationError
      ) {
        return res.status(400).send({ message: err.message });
      }

      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return res.sendStatus(404);
      }

      // 나머지는 공통 errorHandler로 위임
      return errorHandler(err, req, res, next);
    });
  }

  listen() {
    this.#server.listen(3000, () => {
      console.log("The server is listening on port 3000");
    });
  }

  run() {
    this.registerMiddleWare();
    this.registerRouters();
    this.registerExceptionHandler();
    this.listen();
  }

  start() {
    this.run();
  }
}

new Server().run();
