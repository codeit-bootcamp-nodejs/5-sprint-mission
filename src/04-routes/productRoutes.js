import express from 'express';
import * as productController from '../controllers/productController';
import { upload } from '../middleware/imageUpload';
import { errorHandler } from '../middlewares/error';

const router = express.Router();

router
  .route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProductById)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

router.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

router.use(errorHandler);

export default router;
