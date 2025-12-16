import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const productRepository = {
  findMine(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      select: { id: true, name: true, price: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
  },

  list(
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput[],
    skip: number,
    take: number,
  ) {
    return prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    });
  },

  findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  },

  create(data: Prisma.ProductUncheckedCreateInput) {
    return prisma.product.create({ data });
  },

  update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.product.delete({ where: { id } });
  },

  likeUpsert(userId: number, productId: number) {
    return prisma.likeProduct.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  },

  likeDelete(userId: number, productId: number) {
    return prisma.likeProduct
      .delete({
        where: { userId_productId: { userId, productId } },
      })
      .catch(() => null);
  },
  likesOfUserFor(userId: number, productIds: number[]) {
    return prisma.likeProduct.findMany({
      where: { userId, productId: { in: productIds } },
      select: { productId: true },
    });
  },
  findLikedUsers(productId: number) {
    return prisma.likeProduct.findMany({
      where: { productId },
      select: { userId: true },
    });
  },
};
