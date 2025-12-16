import { CommentRepository } from "../repo/comment.repository";
import { ProductRepository } from "../repo/product.repository";
import { ArticleRepository } from "../repo/article.repository";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";
import { HttpError } from "../middlewares/error.handler";
import { Prisma } from "@prisma/client";
import { NotificationService } from "./notification.service";

export class CommentService {
  private commentRepository;
  private productRepository;
  private articleRepository;
  private notificationService;

  constructor(
    commentRepository: CommentRepository,
    productRepository: ProductRepository,
    articleRepository: ArticleRepository,
    notificationService: NotificationService,
  ) {
    this.commentRepository = commentRepository;
    this.productRepository = productRepository;
    this.articleRepository = articleRepository;
    this.notificationService = notificationService;
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
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }

    const newComment = await this.commentRepository.createProductComment(data, authorId, productId);

    if (product.authorId !== authorId) {
      await this.notificationService.createNotification(
        product.authorId,
        `회원님이 등록하신 상품: "${product.name}"에 새로운 댓글이 달렸습니다.`,
        "PRODUCT_COMMENT",
        productId,
        undefined
      );
    }

    return newComment;
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
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    const newComment = await this.commentRepository.createArticleComment(data, authorId, articleId);

    if (article.authorId !== authorId) {
      await this.notificationService.createNotification(
        article.authorId,
        `회원님이 등록하신 게시물: "${article.title}"에 새로운 댓글이 달렸습니다.`,
        "ARTICLE_COMMENT",
        undefined,
        articleId
      );
    }

    return newComment;    
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
