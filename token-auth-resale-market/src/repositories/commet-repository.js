import { BaseRepository } from "./base-repository.js";

export class CommentRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma, prisma.comment);
  }

  create = async (commentData) => {
    const comment = await this.model.create({
      data: commentData,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        productId: true,
        articleId: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
    return comment;
  };

  findById = async (commentId) => {
    const comment = await this.model.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        productId: true,
        articleId: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
    return comment;
  };

  update = async (commentId, content) => {
    const comment = await this.model.update({
      where: { id: commentId },
      data: { content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });
    return comment;
  };

  delete = async (commentId) => {
    const comment = await this.model.delete({
      where: { id: commentId },
    });
    return comment;
  };

  findByProductId = async (productId, query = {}) => {
    const { cursor, limit = 5 } = query;

    const condition = {
      productId: productId,
      ...(cursor ? { id: { lt: parseInt(cursor) } } : {}),
    };

    const comments = await this.model.findMany({
      where: condition,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { id: "desc" },
      take: parseInt(limit) + 1,
    });

    const hasNext = comments.length > parseInt(limit);
    const result = hasNext ? comments.slice(0, -1) : comments;
    const nextCursor = hasNext ? result[result.length - 1].id : null;

    return {
      list: result,
      nextCursor,
    };
  };

  findByArticleId = async (articleId, query = {}) => {
    const { cursor, limit = 5 } = query;

    const condition = {
      articleId: articleId,
      ...(cursor ? { id: { lt: parseInt(cursor) } } : {}),
    };

    const comments = await this.model.findMany({
      where: condition,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
      orderBy: { id: "desc" },
      take: parseInt(limit) + 1,
    });

    const hasNext = comments.length > parseInt(limit);
    const result = hasNext ? comments.slice(0, -1) : comments;
    const nextCursor = hasNext ? result[result.length - 1].id : null;

    return {
      list: result,
      nextCursor,
    };
  };
}
