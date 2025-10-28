import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth";
import { parseIdParam } from "../middlewares/params";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validator";
import * as product from "../controllers/product.controller";

const router = Router();
router.get("/mine", authenticate, product.mine);

router
  .route("/")
  .get(optionalAuthenticate, product.list)
  .post(authenticate, validateCreateProduct, product.create);

router
  .route("/:id")
  .get(optionalAuthenticate, parseIdParam(), product.getOne)
  .patch(authenticate, parseIdParam(), validateUpdateProduct, product.update)
  .delete(authenticate, parseIdParam(), product.remove);

router.post("/:id/like", authenticate, parseIdParam(), product.like);
router.delete("/:id/like", authenticate, parseIdParam(), product.unlike);
export default router;
