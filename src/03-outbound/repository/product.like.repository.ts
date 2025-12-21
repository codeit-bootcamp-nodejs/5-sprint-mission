import { PrismaClient } from "@prisma/client";
import {
  PersistedProductLike,
  ProductLike,
} from "../../02-domain/entity/product.like";
import { IProductLikeRepository } from "../../02-domain/port/repositories/I.product.like.repository";

export const createProductLikeRepository = (
  prisma: PrismaClient,
): IProductLikeRepository => {
  const toggle = async (
    userId: string,
    productId: string,
  ): Promise<PersistedProductLike | null> => {
    try {
      const record = await prisma.productLike.create({
        data: {
          userId,
          productId,
        },
      });
      return ProductLike({
        userId: record.userId,
        productId: record.productId,
      });
    } catch (err) {
      await prisma.productLike.delete({
        where: { userId_productId: { userId, productId } },
      });
    }
    return null;
  };

  const findAll = async (
    productId: string,
  ): Promise<PersistedProductLike[] | null> => {
    const records = await prisma.productLike.findMany({
      where: { productId },
    });

    return records.map((record) => {
      return ProductLike({
        userId: record.userId,
        productId: record.productId,
      });
    });
  };

  return {
    toggle,
    findAll,
  };
};
