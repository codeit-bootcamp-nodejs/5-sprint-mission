import prisma from "../generated/prisma/index.js";

export class CommentService {
  createForProduct = async ({ productId, content }) => {
    return prisma.comment.create({
      data: { content, productId },
    });
  };

  createForArticle = async ({ articleId, content }) => {
    return prisma.comment.create({
      data: { content, articleId },
    });
  };

  update = async (id, data) => {
    return prisma.comment.update({
      where: { id: Number(id) },
      data,
    });
  };

  delete = async (id) => {
    return prisma.comment.delete({
      where: { id: Number(id) },
    });
  };

  listForProduct = async ({ productId, cursor, limit }) => {
    const items = await prisma.comment.findMany({
      where: { productId },
      orderBy: { id: "asc" },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: limit,
    });

    const nextCursor = items.length ? items[items.length - 1].id : null;

    return { items, nextCursor };
  };

  listForArticle = async ({ articleId, cursor, limit }) => {
    const items = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { id: "asc" },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: limit,
    });

    const nextCursor = items.length ? items[items.length - 1].id : null;

    return { items, nextCursor };
  };
}
