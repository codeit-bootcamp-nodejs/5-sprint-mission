import { prisma } from "../lib/prisma";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: number, includePassword = false) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        password: includePassword,
        createdAt: true,
      },
    }),
  create: (email: string, nickname: string, password: string) =>
    prisma.user.create({ data: { email, nickname, password } }),
  update: (id: number, data: { nickname?: string; image?: string | null }) =>
    prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, nickname: true, image: true },
    }),
  updatePassword: (id: number, password: string) =>
    prisma.user.update({ where: { id }, data: { password } }),
  likedProducts: (userId: number) =>
    prisma.likeProduct.findMany({
      where: { userId },
      include: { product: { select: { id: true, name: true, price: true } } },
    }),
};
