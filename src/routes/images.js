import { Router } from "express";
import { upload } from "../middleware/upload.js";

const router = Router();
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "업로드된 파일이 없어요" });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
export default router;
