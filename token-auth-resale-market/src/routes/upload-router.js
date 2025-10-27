import express from "express";
import { uploadController } from "../controllers/upload-controller.js";

const uploadRouter = express.Router();

uploadRouter.post("/profile", upload.single("image"), async (req, res) => {
  const userId = req.user.userId;
  const imagePath = `/uploads/${req.file.filename}`;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { image: imagePath },
  });

  res.status(200).json({
    message: "이미지 업로드 성공",
    data: updatedUser,
  });
});

export default uploadRouter;
