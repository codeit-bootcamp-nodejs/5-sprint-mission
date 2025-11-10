import { PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentRepository {
  createForProduct(productId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: { content, productId, userId },
    });
  }

  createForArticle(articleId: number, content: string, userId: number) {
    return prisma.comment.create({
      data: { content, articleId, userId },
    });
  }

  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  }

  update(id: number, content: string) {
    return prisma.comment.update({ where: { id }, data: { content } });
  }

  delete(id: number) {
    return prisma.comment.delete({ where: { id } });
  }

  listForProduct(productId: number, args: any) {
    return prisma.comment.findMany({
      where: { productId },
      ...args,
    });
  }

  listForArticle(articleId: number, args: any) {
    return prisma.comment.findMany({
      where: { articleId },
      ...args,
    });
  }
}
