import { CreateCommentDTO, UpdateCommentDTO } from "../types/dto";
import { commentRepository } from "../repositories/comment.repository";
import { articleRepository } from "../repositories/article.repository";
import { productRepository } from "../repositories/product.repository";
import { notificationService } from "./notification.service";

export const commentService = {
  listByProduct(productId: number) {
    return commentRepository.listByProduct(productId);
  },

  listByArticle(articleId: number) {
    return commentRepository.listByArticle(articleId);
  },

  async createForProduct(
    userId: number,
    productId: number,
    dto: CreateCommentDTO,
  ) {
    const exists = await productRepository.findById(productId);
    if (!exists)
      throw Object.assign(new Error("상품이 존재하지 않습니다."), {
        status: 404,
      });
    return commentRepository.createForProduct({
      userId,
      productId,
      content: dto.content,
    });
  },

  async createForArticle(
    userId: number,
    articleId: number,
    dto: CreateCommentDTO,
  ) {
    const exists = await articleRepository.findById(articleId);
    if (!exists)
      throw Object.assign(new Error("게시글이 존재하지 않습니다."), {
        status: 404,
      });

    // 1. 댓글 생성
    const comment = await commentRepository.createForArticle({
      userId,
      articleId,
      content: dto.content,
    });

    // 2. 알림 (본인 제외)
    if (exists.userId !== userId) {
      await notificationService.send(
        exists.userId,
        "COMMENT",
        "작성한 게시글에 댓글이 달렸습니다",
      );
    }

    return comment;
  },

  async update(userId: number, commentId: number, dto: UpdateCommentDTO) {
    const c = await commentRepository.findById(commentId);
    if (!c)
      throw Object.assign(new Error("댓글이 존재하지 않습니다."), {
        status: 404,
      });
    if (c.userId !== userId)
      throw Object.assign(new Error("수정 권한이 없습니다."), { status: 403 });
    return commentRepository.update(commentId, { content: dto.content });
  },

  async remove(userId: number, commentId: number) {
    const c = await commentRepository.findById(commentId);
    if (!c)
      throw Object.assign(new Error("댓글이 존재하지 않습니다."), {
        status: 404,
      });
    if (c.userId !== userId)
      throw Object.assign(new Error("삭제 권한이 없습니다."), { status: 403 });
    await commentRepository.remove(commentId);
  },
};
