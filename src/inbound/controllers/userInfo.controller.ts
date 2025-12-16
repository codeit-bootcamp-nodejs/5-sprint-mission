import { Request, Response } from "express";
import { prismaClient } from "../../common/lib/prisma.client";
import bcrypt from "bcrypt";
import { AuthenticatedHandler } from "../../common/types/common";
import {
  UpdateUserInfoRequest,
  ChangePasswordRequest,
} from "../../common/types/requests";

export const getMyInfo: AuthenticatedHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 자신의 정보를 조회할 수 있습니다." });
    return;
  }
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    return;
  }
  res.send(user);
};

export async function updateMyInfo(req: Request, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 자신의 정보를 수정할 수 있습니다." });
    return;
  }
  const { nickname, image } = req.body;
  const updatedUser = await prismaClient.user.update({
    where: { id: userId },
    data: {
      ...(nickname && { nickname }),
      ...(image && { image }),
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.send(updatedUser);
}

export async function changeMyPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res
      .status(401)
      .send({ message: "로그인된 사용자만 비밀번호를 변경할 수 있습니다." });
    return;
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .send({ message: "현재 비밀번호와 새 비밀번호를 입력해야 합니다." });
    return;
  }
  const user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).send({ message: "사용자를 찾을 수 없습니다." });
    return;
  }
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    res.status(403).send({ message: "현재 비밀번호가 올바르지 않습니다." });
    return;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaClient.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  res.send({ message: "비밀번호가 성공적으로 변경되었습니다." });
}

export async function getMyProducts(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).send({
      message: "로그인된 사용자만 자신의 상품 목록을 조회할 수 있습니다.",
    });
    return;
  }
  const products = await prismaClient.product.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      images: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.send({ list: products, totalCount: products.length });
}

export async function getMyArticles(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).send({
      message: "로그인된 사용자만 자신의 게시글 목록을 조회할 수 있습니다.",
    });
    return;
  }
  const articles = await prismaClient.article.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.send({ list: articles, totalCount: articles.length });
}
