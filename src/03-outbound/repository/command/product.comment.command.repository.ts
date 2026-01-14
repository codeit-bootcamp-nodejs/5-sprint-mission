import { PrismaClient } from "@prisma/client/extension";

import { Prisma } from "@prisma/client";
import {
  NewProductComment,
  PersistedProductComment,
} from "../../../02-application/command/entity/product.comment.entity";
import { IProductCommentCommandRepository } from "../../../02-application/port/repositories/command/I.product.comment.repository";
import { ProductCommentMapper } from "../../mapper/product.comment.mapper";

export type PersistProductComment = Prisma.ProductCommentGetPayload<{}>;

export const createProductCommentCommandRepository = (
  prisma: PrismaClient,
): IProductCommentCommandRepository => {
  const save = async (
    entity: NewProductComment,
  ): Promise<PersistedProductComment> => {
    const { productId, content, userId } = entity;
    const productComment = await prisma.productComment.create({
      data: {
        productId,
        content,
        userId,
      },
    });

    return ProductCommentMapper.toPersist(productComment);
  };

  const findProductComments = async (productId: string) => {
    const productComment = await prisma.productComment.findMany({
      where: { productId },
    });

    return productComment.map((record: PersistProductComment) => {
      return ProductCommentMapper.toPersist(record);
    });
  };

  const findProductComment = async (
    commentId: string,
  ): Promise<PersistedProductComment> => {
    const productComment = await prisma.productComment.findUnique({
      where: { id: commentId },
    });
    return ProductCommentMapper.toPersist(productComment);
  };

  const deleteProductComment = async (commentId: string) => {
    await prisma.productComment.delete({
      where: { id: commentId },
    });
  };

  const update = async (
    foundEntity: PersistedProductComment,
    newEntity: NewProductComment,
  ) => {
    const { id } = foundEntity;
    const { userId, productId, content } = newEntity;
    const productComment = await prisma.productComment.update({
      where: { id },
      data: {
        userId,
        productId,
        content,
      },
    });

    return ProductCommentMapper.toPersist(productComment);
  };

  return {
    save,
    findAll: findProductComments,
    findById: findProductComment,
    remove: deleteProductComment,
    update,
  };
};
