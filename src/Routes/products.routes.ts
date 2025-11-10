import { Router } from "express";
import { ProductController } from "../Controller/product.controller";
import { requireAuth, optionalAuth } from "../Middleware/auth.middleware";
import { validateProductCreate } from "../Middleware/validate.middleware";

const router = Router();
const controller = new ProductController();

router
  .route("/products")
  .get(optionalAuth, controller.list)
  .post(requireAuth, validateProductCreate, controller.create);

router
  .route("/products/:id")
  .get(optionalAuth, controller.detail)
  .patch(requireAuth, controller.update)
  .delete(requireAuth, controller.remove);

router.get("/products/mine", requireAuth, controller.myProducts);

router.post("/products/:id/like", requireAuth, controller.like);
router.delete("/products/:id/like", requireAuth, controller.unlike);

export default router;
