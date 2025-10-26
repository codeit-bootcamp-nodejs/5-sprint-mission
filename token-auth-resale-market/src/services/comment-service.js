import { CommentRepository } from "../repositories/comment-repository.js";

export class CommentService {
  constructor(prisma) {
    this.commentRepository = new CommentRepository(prisma);
    this.prisma = prisma;
  }

  async createProductComment(productId, userId, content) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("존재하지 않는 상품입니다");
    }

    const comment = await this.commentRepository.create({
      content,
      authorId: userId,
      productId: productId,
    });

    return comment;
  }

  async createArticleComment(articleId, userId, content) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new Error("존재하지 않는 게시글입니다");
    }

    const comment = await this.commentRepository.create({
      content,
      authorId: userId,
      articleId: articleId,
    });

    return comment;
  }

  async updateComment(commentId, userId, content) {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("존재하지 않는 댓글입니다");
    }

    if (comment.authorId !== userId) {
      throw new Error("본인의 댓글만 수정할 수 있습니다");
    }

    const updatedComment = await this.commentRepository.update(
      commentId,
      content,
    );
    return updatedComment;
  }

  async deleteComment(commentId, userId) {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error("존재하지 않는 댓글입니다");
    }

    if (comment.authorId !== userId) {
      throw new Error("본인의 댓글만 삭제할 수 있습니다");
    }

    await this.commentRepository.delete(commentId);
    return true;
  }

  async getProductComments(productId, query) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("존재하지 않는 상품입니다");
    }

    const result = await this.commentRepository.findByProductId(
      productId,
      query,
    );
    return result;
  }

  async getArticleComments(articleId, query) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new Error("존재하지 않는 게시글입니다");
    }

    const result = await this.commentRepository.findByArticleId(
      articleId,
      query,
    );
    return result;
  }
}
