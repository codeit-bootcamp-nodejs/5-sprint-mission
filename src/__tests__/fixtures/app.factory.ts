import express, { Express } from "express";
import articlesRouter from "../../inbound/routers/articles.router";

export function createTestApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/articles", articlesRouter);

  return app;
}
