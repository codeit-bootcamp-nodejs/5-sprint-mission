import { PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../../domain/ports/I.article.repository";
import { Article } from "../../domain/entities/article.entity";
import { ID } from "../../common/types/common";

export class PrismaArticleRepository implements IArticleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    title: string;
    content: string;
    image?: string | null;
    userId: ID;
  }): Promise<Article> {
    const raw = await this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        userId: data.userId,
      },
    });

    return this.toDomain(raw);
  }

  async findById(id: ID): Promise<Article | null> {
    const raw = await this.prisma.article.findUnique({
      where: { id },
    });

    return raw ? this.toDomain(raw) : null;
  }

  async findMany(query: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
  }): Promise<{ items: Article[]; total: number }> {
    const where = {
      title: query.keyword
        ? { contains: query.keyword, mode: "insensitive" as const }
        : undefined,
    };

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: {
          createdAt: query.orderBy === "recent" ? "desc" : "asc",
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      items: items.map((item: any) => this.toDomain(item)),
      total,
    };
  }

  async update(
    id: ID,
    data: {
      title?: string;
      content?: string;
      image?: string | null;
    },
  ): Promise<Article> {
    const raw = await this.prisma.article.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    return this.toDomain(raw);
  }

  async delete(id: ID): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }

  async countByUserId(userId: ID): Promise<number> {
    return await this.prisma.article.count({
      where: { userId },
    });
  }

  async exists(id: ID): Promise<boolean> {
    const count = await this.prisma.article.count({
      where: { id },
    });
    return count > 0;
  }

  private toDomain(raw: any): Article {
    return new Article({
      id: raw.id,
      title: raw.title,
      content: raw.content,
      image: raw.image,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
