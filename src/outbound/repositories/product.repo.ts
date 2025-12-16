import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "../../domain/ports/I.product.repository";
import { Product } from "../../domain/entities/product.entity";
import { ID } from "../../common/types/common";

export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    userId: ID;
  }): Promise<Product> {
    const raw = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
        images: data.images,
        userId: data.userId,
      },
    });

    return this.toDomain(raw);
  }

  async findById(id: ID): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { id },
    });

    return raw ? this.toDomain(raw) : null;
  }

  async findMany(query: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
  }): Promise<{ items: Product[]; total: number }> {
    const where = {
      name: query.keyword
        ? { contains: query.keyword, mode: "insensitive" as const }
        : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: {
          createdAt: query.orderBy === "recent" ? "desc" : "asc",
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
    };
  }

  async update(
    id: ID,
    data: {
      name?: string;
      description?: string;
      price?: number;
      tags?: string[];
      images?: string[];
    },
  ): Promise<Product> {
    const raw = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.tags && { tags: data.tags }),
        ...(data.images && { images: data.images }),
      },
    });

    return this.toDomain(raw);
  }

  async delete(id: ID): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async countByUserId(userId: ID): Promise<number> {
    return await this.prisma.product.count({
      where: { userId },
    });
  }

  async exists(id: ID): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id },
    });
    return count > 0;
  }

  async findPriceHistoryById(
    id: ID,
    limit: number = 5,
  ): Promise<{ price: number; updatedAt: Date }[]> {
    const products = await this.prisma.product.findMany({
      where: { id },
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: { price: true, updatedAt: true },
    });

    return products.map((p) => ({
      price: p.price,
      updatedAt: p.updatedAt,
    }));
  }

  private toDomain(raw: any): Product {
    return new Product({
      id: raw.id,
      name: raw.name,
      description: raw.description,
      price: raw.price,
      tags: raw.tags,
      images: raw.images,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
