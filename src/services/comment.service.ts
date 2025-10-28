import { commentRepository } from "../repositories/comment.repository";

export const commentService = {
  listForProduct: async (
    viewerId: number | undefined,
    productId: number,
    cursor?: number,
    limit: number = 10,
  ) => {
    const items = await commentRepository.listByProduct(
      productId,
      cursor,
      limit,
    );
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : null;
    return {
      items: items.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        mine: viewerId ? c.userId === viewerId : false,
      })),
      nextCursor,
    };
  },

  listForArticle: async (
    viewerId: number | undefined,
    articleId: number,
    cursor?: number,
    limit: number = 10,
  ) => {
    const items = await commentRepository.listByArticle(
      articleId,
      cursor,
      limit,
    );
    const nextCursor =
      items.length === limit ? items[items.length - 1].id : null;
    return {
      items: items.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        mine: viewerId ? c.userId === viewerId : false,
      })),
      nextCursor,
    };
  },

  createForProduct: (userId: number, productId: number, content: string) =>
    commentRepository.createForProduct({ content, userId, productId }),

  createForArticle: (userId: number, articleId: number, content: string) =>
    commentRepository.createForArticle({ content, userId, articleId }),

  async update(userId: number, commentId: number, content: string) {
    const exists = await commentRepository.findById(commentId);
    if (!exists) {
      const e: any = new Error("댓글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("수정 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    const updated = await commentRepository.update(commentId, { content });
    return {
      id: updated.id,
      content: updated.content,
      createdAt: updated.createdAt,
    };
  },

  async remove(userId: number, commentId: number) {
    const exists = await commentRepository.findById(commentId);
    if (!exists) {
      const e: any = new Error("댓글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("삭제 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    await commentRepository.delete(commentId);
  },
};
