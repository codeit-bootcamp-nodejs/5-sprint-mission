import { Router } from "express";
import { ProductController } from "../02-controller/product.controller.js";
import { requireAuth } from "../05-middleware/auth.middleware.js";
import { validateProductCreate } from "../05-middleware/validate.middleware.js";

const router = Router();
const controller = new ProductController();

router
  .route("/products")
  .get(controller.list)
  .post(requireAuth, validateProductCreate, controller.create);

router
  .route("/products/:id")
  .get(controller.detail)
  .patch(requireAuth, controller.update)
  .delete(requireAuth, controller.remove);

router.post("/products/:id/like", requireAuth, controller.like);
router.delete("/products/:id/like", requireAuth, controller.unlike);

export default router;
