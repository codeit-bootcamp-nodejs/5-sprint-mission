import { Request, Response } from "express";
import { prismaClient } from "../lib/prismaClient";
import bcrypt from "bcrypt";
import {
  signToken,
  signRefreshToken,
  verifyToken,
  JwtPayload,
} from "../lib/jwt";
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
} from "../types/requests";
import { ExpressHandler } from "../types/common";

export const registerUser: ExpressHandler = async (
  req: RegisterRequest,
  res: Response
): Promise<void> => {
  const { email, nickname, password } = req.body;
  if (!email || !nickname || !password) {
    res
      .status(400)
      .send({ message: "email, nickname, password는 필수입니다." });
    return;
  }


  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) {
    res.status(409).send({ message: "이미 가입된 이메일입니다." });
    return;
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prismaClient.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });


  const { password: _, ...userData } = user;
  res.status(201).send(userData);
};

export async function loginUser(
  req: LoginRequest,
  res: Response
): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: "email, password는 필수입니다." });
    return;
  }

  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    res
      .status(401)
      .send({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res
      .status(401)
      .send({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }


  const token = signToken({
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  });
  const refreshToken = signRefreshToken({ userId: user.id });
  await prismaClient.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.send({ accessToken: token, refreshToken });
}

export async function refreshToken(
  req: RefreshTokenRequest,
  res: Response
): Promise<void> {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send({ message: "Refresh Token이 필요합니다." });
    return;
  }
  let payload: JwtPayload;
  try {
    payload = verifyToken(refreshToken);
  } catch (e) {
    res.status(401).send({ message: "유효하지 않은 Refresh Token입니다." });
    return;
  }
  const user = await prismaClient.user.findUnique({
    where: { id: payload.userId },
  });
  if (!user || user.refreshToken !== refreshToken) {
    res.status(401).send({ message: "Refresh Token이 일치하지 않습니다." });
    return;
  }
  const newAccessToken = signToken({
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
  });
  res.send({ accessToken: newAccessToken });
}
