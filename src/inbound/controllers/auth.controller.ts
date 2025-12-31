import { Request, Response } from "express";
import { create } from "superstruct";
import bcrypt from "bcrypt";
import { prismaClient } from "../../common/lib/prisma.client";
import { signToken, signRefreshToken } from "../../common/lib/jwt";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../common/errors/business.exception";
import { ExpressHandler } from "../../common/types/common";

export const signUp: ExpressHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, nickname } = req.body;
  const existingUser = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new BusinessException({
      type: BusinessExceptionType.EMAIL_DUPLICATE,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname,
    },
  });
  const accessToken = signToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  res.status(201).json({
    data: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      accessToken,
      refreshToken,
    },
    message: "회원가입 성공",
  });
};

export const signIn: ExpressHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BusinessException({
      type: BusinessExceptionType.USER_NOT_FOUND,
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new BusinessException({
      type: BusinessExceptionType.INVALID_PASSWORD,
    });
  }
  const accessToken = signToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  res.status(200).json({
    data: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      accessToken,
      refreshToken,
    },
    message: "로그인 성공",
  });
};
