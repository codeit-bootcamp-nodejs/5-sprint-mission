import express from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signAccess, signRefresh, verifyRefresh } from "../lib/token.js";
import { validateSignup, validateLogin } from "../middlewares/validator.js";

const router = express.Router();

router.post("/signup", validateSignup, async (req, res, next) => {
  try {
    const { email, nickname, password } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "이미 가입된 이메일입니다." });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, nickname, password: hashed },
    });
    res.status(201).json({ id: user.id, email, nickname });
  } catch (e) {
    next(e);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    res.json({
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    });
  } catch (e) {
    next(e);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "refreshToken이 없습니다." });
    const payload = verifyRefresh(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.status(401).json({ message: "유효하지 않은 토큰" });
    res.json({
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
