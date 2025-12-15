import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import { parseIdParam } from "../middlewares/params";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validator";
import * as p from "../controllers/product.controller";

const router = Router();

router.get("/", optionalAuthenticate, p.list);
router.get("/mine", authenticate, p.mine);
router.get(
  "/:productId",
  optionalAuthenticate,
  parseIdParam("productId"),
  p.getById,
);

router.post("/", authenticate, validateCreateProduct, p.create);

router.patch(
  "/:productId",
  authenticate,
  parseIdParam("productId"),
  validateUpdateProduct,
  p.update,
);

router.delete("/:productId", authenticate, parseIdParam("productId"), p.remove);

router.post(
  "/:productId/like",
  authenticate,
  parseIdParam("productId"),
  p.like,
);

router.delete(
  "/:productId/like",
  authenticate,
  parseIdParam("productId"),
  p.unlike,
);

export default router;
