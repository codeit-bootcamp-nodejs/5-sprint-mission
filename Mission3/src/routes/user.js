import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  validateUpdateMe,
  validateChangePassword,
} from "../middlewares/validator/validate.user.js";
import upload from "../middlewares/upload.js";

const prisma = new PrismaClient();
const router = Router();

const resData = (user) => {
  const { password, refreshToken, ...res } = user;
  return res;
};

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json(resData(user));
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/me",
  authMiddleware,
  validateUpdateMe,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { nickname, image } = req.body;

      const dataToUpdate = {};
      if (nickname) dataToUpdate.nickname = nickname;
      if (image) dataToUpdate.image = image;

      if (nickname) {
        const existingUser = await prisma.user.findFirst({
          where: {
            nickname,
            id: { not: userId },
          },
        });
        if (existingUser) {
          return res.status(409).json({ error: "이미 사용중인 닉네임입니다." });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      res.status(200).json(resData(updatedUser));
    } catch (e) {
      next(e);
    }
  },
);

router.patch(
  "/me/password",
  authMiddleware,
  validateChangePassword,
  async (req, res, next) => {
    try {
      const { id: userId } = req.user;
      const { currentPassword, newPassword } = req.body;

      const user = req.user;
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "현재 비밀번호가 올바르지 않습니다." });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
);

router.get("/me/products", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const products = await prisma.product.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json(products);
  } catch (e) {
    next(e);
  }
});

router.get("/me/liked-products", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const likedProducts = await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json(likedProducts);
  } catch (e) {
    next(e);
  }
});

router.post("/upload", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "이미지 파일을 찾을 수 없습니다." });
  }
  const imageUrl = `/api/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

export default router;
