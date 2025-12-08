import { CommentRepository } from "../repo/comment.repository";
import { ProductRepository } from "../repo/product.repository";
import { ArticleRepository } from "../repo/article.repository";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { HttpError } from "../middlewares/error.handler";
import { Prisma } from "@prisma/client";

export class CommentService {
  private commentRepository;
  private productRepository;
  private articleRepository;

  constructor(commentRepository: CommentRepository, productRepository: ProductRepository, articleRepository: ArticleRepository) {
    this.commentRepository = commentRepository;
    this.productRepository = productRepository;
    this.articleRepository = articleRepository;
  }

  public async getProductComments(
    productId: number,
    cursor: number | undefined,
    take: number,
  ) {
    const product = await this.productRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }
    return this.commentRepository.findProductComments(productId, cursor, take);
  }

  public async createProductComment(
    data: CreateCommentDto,
    authorId: number,
    productId: number,
  ) {
    const product = await this.productRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }
    return this.commentRepository.createProductComment(data, authorId, productId);
  }

  public async updateProductComment(
    commentId: number,
    userId: number,
    data: UpdateCommentDto,
  ) {
    const comment =
      await this.commentRepository.findProductCommentById(commentId);
    if (!comment) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }
    if (comment.authorId !== userId) {
      throw new HttpError(403, "댓글을 수정할 권한이 없습니다.");
    }
    return this.commentRepository.updateProductComment(commentId, data);
  }

  public async deleteProductComment(commentId: number, userId: number) {
    const comment =
      await this.commentRepository.findProductCommentById(commentId);
    if (!comment) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }
    if (comment.authorId !== userId) {
      throw new HttpError(403, "댓글을 삭제할 권한이 없습니다.");
    }

    try {
      await this.commentRepository.deleteProductComment(commentId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HttpError(404, "댓글을 찾을 수 없습니다.");
        }
      }
      throw error;
    }
  }

  public async getArticleComments(
    articleId: number,
    cursor: number | undefined,
    take: number,
  ) {
    const article =
      await this.articleRepository.findArticleByIdSimple(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }
    return this.commentRepository.findArticleComments(articleId, cursor, take);
  }

  public async createArticleComment(
    data: CreateCommentDto,
    authorId: number,
    articleId: number,
  ) {
    const article =
      await this.articleRepository.findArticleByIdSimple(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }
    return this.commentRepository.createArticleComment(data, authorId, articleId);
  }

  public async updateArticleComment(
    commentId: number,
    userId: number,
    data: UpdateCommentDto,
  ) {
    const comment =
      await this.commentRepository.findArticleCommentById(commentId);
    if (!comment) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }
    if (comment.authorId !== userId) {
      throw new HttpError(403, "댓글을 수정할 권한이 없습니다.");
    }
    return this.commentRepository.updateArticleComment(commentId, data);
  }

  public async deleteArticleComment(commentId: number, userId: number) {
    const comment =
      await this.commentRepository.findArticleCommentById(commentId);
    if (!comment) {
      throw new HttpError(404, "댓글을 찾을 수 없습니다.");
    }
    if (comment.authorId !== userId) {
      throw new HttpError(403, "댓글을 삭제할 권한이 없습니다.");
    }

    try {
      await this.commentRepository.deleteArticleComment(commentId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HttpError(404, "댓글을 찾을 수 없습니다.");
        }
      }
      throw error;
    }
  }
}
