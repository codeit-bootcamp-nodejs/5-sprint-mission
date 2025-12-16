import { PrismaClient } from "@prisma/client";
import { ICommentRepository } from "../../domain/ports/I.comment.repository";
import { Comment } from "../../domain/entities/comment.entity";
import { ID } from "../../common/types/common";

export class PrismaCommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    content: string;
    userId: ID;
    articleId?: ID | null;
    productId?: ID | null;
  }): Promise<Comment> {
    const raw = await this.prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        articleId: data.articleId,
        productId: data.productId,
      },
    });

    return this.toDomain(raw);
  }

  async findById(id: ID): Promise<Comment | null> {
    const raw = await this.prisma.comment.findUnique({
      where: { id },
    });

    return raw ? this.toDomain(raw) : null;
  }

  async findByArticleId(
    articleId: ID,
    query: {
      cursor?: ID;
      limit: number;
    },
  ): Promise<{ items: Comment[]; nextCursor: ID | null }> {
    const items = await this.prisma.comment.findMany({
      where: { articleId },
      cursor: query.cursor ? { id: query.cursor } : undefined,
      take: query.limit + 1,
      orderBy: { createdAt: "desc" },
    });

    const comments = items.slice(0, query.limit);
    const nextItem = items[query.limit];
    const nextCursor = nextItem ? nextItem.id : null;

    return {
      items: comments.map((item) => this.toDomain(item)),
      nextCursor,
    };
  }

  async findByProductId(
    productId: ID,
    query: {
      cursor?: ID;
      limit: number;
    },
  ): Promise<{ items: Comment[]; nextCursor: ID | null }> {
    const items = await this.prisma.comment.findMany({
      where: { productId },
      cursor: query.cursor ? { id: query.cursor } : undefined,
      take: query.limit + 1,
      orderBy: { createdAt: "desc" },
    });

    const comments = items.slice(0, query.limit);
    const nextItem = items[query.limit];
    const nextCursor = nextItem ? nextItem.id : null;

    return {
      items: comments.map((item) => this.toDomain(item)),
      nextCursor,
    };
  }

  async update(
    id: ID,
    data: {
      content: string;
    },
  ): Promise<Comment> {
    const raw = await this.prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
      },
    });

    return this.toDomain(raw);
  }

  async delete(id: ID): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async countByUserId(userId: ID): Promise<number> {
    return await this.prisma.comment.count({
      where: { userId },
    });
  }

  private toDomain(raw: any): Comment {
    return new Comment({
      id: raw.id,
      content: raw.content,
      userId: raw.userId,
      articleId: raw.articleId,
      productId: raw.productId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
