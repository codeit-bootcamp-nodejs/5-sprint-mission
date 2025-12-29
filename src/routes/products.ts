import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import authOptionalMiddleware from "../middlewares/auth.optional.middleware";
import { validateProduct } from "../middlewares/validator/validate.product";
import { ProductRepository } from "../repo/product.repository";
import { ProductService } from "../service/product.service";
import { ProductController } from "../controller/product.controller";
import { NotificationRepository } from "../repo/notification.repository";
import { NotificationService } from "../service/notification.service";
import { notificationGateway } from "../gateway/notification.gateway";

const productRepository = new ProductRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(
  notificationRepository,
  notificationGateway,
);
const productService = new ProductService(
  productRepository,
  notificationService,
);
const productController = new ProductController(productService);

const router = Router();

router.post(
  "/",
  authMiddleware,
  validateProduct,
  productController.createProduct,
);
router.get("/", authOptionalMiddleware, productController.getProducts);
router.get("/:id", authOptionalMiddleware, productController.getProductById);
router.patch(
  "/:id",
  authMiddleware,
  validateProduct,
  productController.updateProduct,
);
router.delete("/:id", authMiddleware, productController.deleteProduct);
router.post("/:id/like", authMiddleware, productController.toggleProductLike);

export default router;
