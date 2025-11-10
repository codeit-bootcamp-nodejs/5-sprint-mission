import { PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductRepository {
  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    return prisma.product.create({ data });
  }

  findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  update(id: number, data: Partial<Product>) {
    return prisma.product.update({ where: { id }, data });
  }

  delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }

  findMany(args: any) {
    return prisma.product.findMany(args);
  }

  count(where?: any) {
    return prisma.product.count({ where });
  }

  findByUser(userId: number) {
    return prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
