import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const productRepository = {
  findMine: (userId: number) =>
    prisma.product.findMany({
      where: { userId },
      select: { id: true, name: true, price: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  list: (
    where: Prisma.ProductWhereInput,
    orderBy: any[],
    skip: number,
    take: number,
  ) =>
    prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        select: { id: true, name: true, price: true, createdAt: true },
      }),
      prisma.product.count({ where }),
    ]),
  findById: (id: number) => prisma.product.findUnique({ where: { id } }),
  create: (data: any) => prisma.product.create({ data }),
  update: (id: number, data: any) =>
    prisma.product.update({ where: { id }, data }),
  delete: (id: number) => prisma.product.delete({ where: { id } }),
  likeUpsert: (userId: number, productId: number) =>
    prisma.likeProduct.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    }),
  likeDelete: (userId: number, productId: number) =>
    prisma.likeProduct
      .delete({
        where: { userId_productId: { userId, productId } },
      })
      .catch(() => null),
  likesOfUserFor: (userId: number, productIds: number[]) =>
    prisma.likeProduct.findMany({
      where: { userId, productId: { in: productIds } },
      select: { productId: true },
    }),
};
