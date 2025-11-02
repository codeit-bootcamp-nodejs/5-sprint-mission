import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  validateSignUp,
  validateLogin,
  validateToken,
} from "../middlewares/validator/validate.auth.js";

const prisma = new PrismaClient();
const router = Router();

const createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "12h",
  });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
};

router.post("/signup", validateSignUp, async (req, res, next) => {
  try {
    const { email, nickname, password: normalPassword } = req.body;

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return res.status(409).json({ error: "이미 사용중인 이메일입니다." });
    }

    const existingUserByNickname = await prisma.user.findUnique({
      where: { nickname },
    });
    if (existingUserByNickname) {
      return res.status(409).json({ error: "이미 사용중인 닉네임입니다." });
    }

    const hashedPassword = await bcrypt.hash(normalPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });

    const { password, ...rest } = user;

    res.status(201).json(rest);
  } catch (e) {
    next(e);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

router.post("/token", validateToken, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    } catch (e) {
      return res
        .status(401)
        .json({ error: "Refresh Token이 유효하지 않습니다." });
    }

    const userId = payload.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ error: "Refresh Token이 일치하지 않습니다." });
    }

    const newAccessToken = createAccessToken(userId);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

export default router;
