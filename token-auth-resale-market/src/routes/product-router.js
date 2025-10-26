import express from "express";
import { ProductController } from "../controllers/product-controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
const productController = new ProductController();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductDetail);
router.post("/", authMiddleware, productController.createProduct);
router.patch("/:id", authMiddleware, productController.updateProduct);
router.delete("/:id", authMiddleware, productController.deleteProduct);

export default router;
