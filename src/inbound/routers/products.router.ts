import express, { Router, Request, Response } from "express";
import { withAsync } from "../../common/lib/withAsync";
import { authMiddleware } from "../../common/lib/auth.middleware";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
  createComment,
  getCommentList,
} from "../controllers/products.controller";

const productsRouterCA: Router = express.Router();

productsRouterCA.post(
  "/",
  authMiddleware,
  withAsync((req: Request, res: Response) => createProduct(req, res)),
);

productsRouterCA.get(
  "/",
  withAsync((req: Request, res: Response) => getProductList(req, res)),
);

productsRouterCA.get(
  "/:id",
  withAsync((req: Request, res: Response) => getProduct(req, res)),
);

productsRouterCA.patch(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => updateProduct(req, res)),
);

productsRouterCA.delete(
  "/:id",
  authMiddleware,
  withAsync((req: Request, res: Response) => deleteProduct(req, res)),
);

productsRouterCA.post(
  "/:id/comments",
  authMiddleware,
  withAsync((req: Request, res: Response) => createComment(req, res)),
);

productsRouterCA.get(
  "/:id/comments",
  withAsync((req: Request, res: Response) => getCommentList(req, res)),
);

export default productsRouterCA;
