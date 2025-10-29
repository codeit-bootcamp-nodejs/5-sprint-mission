import { prismaClient } from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';

export async function getMyInfo(req, res) {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).send({ message: '로그인된 사용자만 자신의 정보를 조회할 수 있습니다.' });
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
    return res.status(404).send({ message: '사용자를 찾을 수 없습니다.' });
  }
  return res.send(user);
}

export async function updateMyInfo(req, res) {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).send({ message: '로그인된 사용자만 자신의 정보를 수정할 수 있습니다.' });
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
  return res.send(updatedUser);
}

export async function changeMyPassword(req, res) {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).send({ message: '로그인된 사용자만 비밀번호를 변경할 수 있습니다.' });
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: '현재 비밀번호와 새 비밀번호를 입력해야 합니다.' });
  }
  const user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).send({ message: '사용자를 찾을 수 없습니다.' });
  }
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return res.status(403).send({ message: '현재 비밀번호가 올바르지 않습니다.' });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prismaClient.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return res.send({ message: '비밀번호가 성공적으로 변경되었습니다.' });
}

export async function getMyProducts(req, res) {
  const userId = req.user?.userId;
  if (!userId) {
    return res
      .status(401)
      .send({ message: '로그인된 사용자만 자신의 상품 목록을 조회할 수 있습니다.' });
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
  return res.send({ list: products, totalCount: products.length });
}
