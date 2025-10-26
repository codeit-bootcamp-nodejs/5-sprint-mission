import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ProductService {
  badRequest(message = "Bad Request") {
    const e = new Error(message);
    e.status = 400;
    throw e;
  }

  notFound(message = "Resource not found") {
    const e = new Error(message);
    e.status = 404;
    throw e;
  }

  create(data) {
    return prisma.product.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      },
    });
  }

  async getById(id) {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        updatedAt: true
      },
    });
    if (!product) this.notFound("Product not found");
    return product;
  }

  async update(id, data) {
    if (!Object.keys(data || {}).length) this.badRequest('Nothing to update');
    try {
      return await prisma.product.update({
        where: {
          id: Number(id)
        },
        data,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
          updatedAt: true
        },
      });
    } catch {
      this.notFound('Product not found');
    }
  }

  async delete(id) {
    try {
      await prisma.product.delete({ where: { id: Number(id) } });
      return true;
    } catch {
      this.notFound('Product not found');
    }
  }

  async list({ skip, take, search, sort }) {
    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
      : undefined;

    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : { id: 'asc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true
        },
      }),
      prisma.product.count({ where }),
    ]);
    return { items, total };
  }
}