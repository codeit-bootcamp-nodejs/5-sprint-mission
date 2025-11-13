import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const userRepository = {
  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findWithPasswordById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findWithPasswordByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  create(data: { email: string; nickname: string; password: string }) {
    return prisma.user.create({ data });
  },

  update(id: number, data: { nickname?: string; image?: string | null }) {
    const payload: Prisma.UserUpdateInput = {};
    if (data.nickname !== undefined) payload.nickname = data.nickname;
    if (data.image !== undefined) payload.image = data.image;
    return prisma.user.update({ where: { id }, data: payload });
  },

  updatePassword(id: number, hashed: string) {
    return prisma.user.update({ where: { id }, data: { password: hashed } });
  },

  likedProducts(userId: number) {
    return prisma.likeProduct
      .findMany({
        where: { userId },
        select: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      .then((rows) => rows.map((r) => r.product));
  },
};
