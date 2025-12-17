import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Injected } from "./injector";

export function createApp({ controllers, middlewares }: Injected) {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static("uploads"));

  app.use(controllers.auth.path, controllers.auth.router);
  app.use(controllers.user.path, controllers.user.router);
  app.use(controllers.prouduct.path, controllers.prouduct.router);
  app.use(controllers.article.path, controllers.article.router);
  app.use(controllers.comment.path, controllers.comment.router);
  app.use(controllers.image.path, controllers.image.router);
  app.use(controllers.notification.path, controllers.notification.router);

  app.use(middlewares.defaultError.handler());
  app.use(middlewares.globalError.handler());

  return app;
}
