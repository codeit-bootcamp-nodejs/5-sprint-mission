import express from "express";


const uploadRouter = express.Router();

uploadRouter.post("/profile", upload.single("image"), async (req, res) => {
  const userId = req.user.id;
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
