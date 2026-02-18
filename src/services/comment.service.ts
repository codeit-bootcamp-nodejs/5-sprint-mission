import { CreateCommentDTO, UpdateCommentDTO } from "@/types/dto";
import { commentRepository } from "../repositories/comment.repository";
import { articleRepository } from "../repositories/article.repository";
import { productRepository } from "../repositories/product.repository";

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
    return commentRepository.createForArticle({
      userId,
      articleId,
      content: dto.content,
    });
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
