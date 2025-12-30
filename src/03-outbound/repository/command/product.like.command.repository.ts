import { PrismaClient } from "@prisma/client";
import {
  PersistedProductLike,
  ProductLike,
} from "../../../02-application/command/entity/product.like";
import { IProductLikeCommandRepository } from "../../../02-application/port/repositories/command/I.product.like.repository";

export const createProductLikeCommandRepository = (
  prisma: PrismaClient,
): IProductLikeCommandRepository => {
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
