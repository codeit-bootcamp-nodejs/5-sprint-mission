import { PrismaClient, Article } from "@prisma/client";

const prisma = new PrismaClient();

export class ArticleRepository {
  create(data: Omit<Article, "id" | "createdAt" | "updatedAt">) {
    return prisma.article.create({ data });
  }

  findById(id: number) {
    return prisma.article.findUnique({ where: { id } });
  }

  update(id: number, data: Partial<Article>) {
    return prisma.article.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.article.delete({ where: { id } });
  }

  findMany(args: any) {
    return prisma.article.findMany(args);
  }

  count(where?: any) {
    return prisma.article.count({ where });
  }
}
