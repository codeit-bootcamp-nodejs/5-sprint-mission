import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Server } from "./app/server";

import { articleRoutesFactory } from "./routes/articleRoutes";
import { productRoutesFactory } from "./routes/productRoutes";
import { commentRoutesFactory } from "./routes/commentRoutes";
import { userRoutesFactory } from "./routes/userRoutes";
import { notificationRoutesFactory } from "./routes/notificationRoutes";

import { ArticleController } from "./controller/articleController";
import { ProductController } from "./controller/productController";
import { CommentController } from "./controller/commentController";
import { UserController } from "./controller/userController";
import { NotificationController } from "./controller/notificationController";

import { ArticleService } from "./service/articleService";
import { ProductService } from "./service/productService";
import { CommentService } from "./service/commentService";
import { UserService } from "./service/userService";
import { NotificationService } from "./service/notificationService";

import { CONFIG_KEY } from "./common/config.js";

const prisma = new PrismaClient();

const notificationService = new NotificationService(prisma);
const articleService = new ArticleService(prisma, notificationService);
const productService = new ProductService(prisma, notificationService);
const commentService = new CommentService(prisma);
const userService = new UserService(prisma);

const articleController = new ArticleController(articleService);
const productController = new ProductController(productService);
const commentController = new CommentController(commentService);
const userController = new UserController(userService);
const notificationController = new NotificationController(notificationService);

const routers = {
  article: {
    path: "/articles",
    handler: articleRoutesFactory(articleController),
  },
  product: {
    path: "/products",
    handler: productRoutesFactory(productController),
  },
  comment: { path: "/", handler: commentRoutesFactory(commentController) },
  user: { path: "/users", handler: userRoutesFactory(userController) },
  notification: {
    path: "/notifications",
    handler: notificationRoutesFactory(notificationController),
  },
};

const config = new Map<string, any>([
  [CONFIG_KEY.PORT, Number(process.env.PORT ?? 3000)],
]);

const server = new Server({ routers, config });

notificationService.setIO(server.io);

server.start();
