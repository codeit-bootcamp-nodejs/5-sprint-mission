import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
    },
  });
  res.json(me);
});

router.patch("/me", authenticate, async (req, res) => {
  const { nickname, image } = req.body;
  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data: { nickname, image },
    select: { id: true, email: true, nickname: true, image: true },
  });
  res.json(updated);
});

router.patch("/me/password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const ok = await bcrypt.compare(currentPassword, req.user.password);
  if (!ok)
    return res
      .status(400)
      .json({ message: "현재 비밀번호가 일치하지 않습니다." });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });
  res.json({ message: "비밀번호 변경 완료" });
});

router.get("/me/products", authenticate, async (req, res) => {
  const products = await prisma.product.findMany({
    where: { userId: req.user.id },
    select: { id: true, name: true, price: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

router.get("/me/likes/products", authenticate, async (req, res) => {
  const liked = await prisma.likeProduct.findMany({
    where: { userId: req.user.id },
    include: { product: { select: { id: true, name: true, price: true } } },
  });
  res.json(liked.map((l) => l.product));
});

export default router;
