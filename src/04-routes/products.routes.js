import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { ProductController } from "../02-controller/product.controller.js";
import { validateProductCreate } from "../05-middleware/validate.middleware.js";

const router = Router();
const controller = new ProductController();

const uploadDir = process.env.UPLOAD_DIR || 'uploads'; 
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

router
  .route('/products')
  .get(controller.list)
  .post(validateProductCreate, controller.create);

router
  .route('/products/:id')
  .get(controller.detail)
  .patch(controller.update)
  .delete(controller.remove);

router.post('/products/upload', upload.single('image'), (req, res) => {
  const filePath = `/${uploadDir}/${req.file.filename}`;
  res.status(201).json({ path: filePath });
});

export default router;
