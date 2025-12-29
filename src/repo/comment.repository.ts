import prisma from "../prisma.client";
import { ArticleComment, ProductComment } from "@prisma/client";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";

export class CommentRepository {
  async findProductComments(
    productId: number,
    cursor: number | undefined,
    take: number,
  ) {
    const comments = await prisma.productComment.findMany({
      where: { productId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
      },
    });

    return comments.map((comment) => ({
      ...comment,
      authorNickname: comment.author.nickname,
      author: undefined,
    }));
  }

  async findProductCommentById(
    commentId: number,
  ): Promise<ProductComment | null> {
    return prisma.productComment.findUnique({
      where: { id: commentId },
    });
  }

  async createProductComment(
    data: CreateCommentDto,
    authorId: number,
    productId: number,
  ): Promise<ProductComment> {
    return prisma.productComment.create({
      data: {
        ...data,
        authorId,
        productId,
      },
    });
  }

  async updateProductComment(
    commentId: number,
    data: UpdateCommentDto,
  ): Promise<ProductComment> {
    return prisma.productComment.update({
      where: { id: commentId },
      data,
    });
  }

  async deleteProductComment(commentId: number): Promise<void> {
    await prisma.productComment.delete({
      where: { id: commentId },
    });
  }

  async findArticleComments(
    articleId: number,
    cursor: number | undefined,
    take: number,
  ) {
    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
      },
    });

    return comments.map((comment) => ({
      ...comment,
      authorNickname: comment.author.nickname,
      author: undefined,
    }));
  }

  async findArticleCommentById(
    commentId: number,
  ): Promise<ArticleComment | null> {
    return prisma.articleComment.findUnique({
      where: { id: commentId },
    });
  }

  async createArticleComment(
    data: CreateCommentDto,
    authorId: number,
    articleId: number,
  ): Promise<ArticleComment> {
    return prisma.articleComment.create({
      data: {
        ...data,
        authorId,
        articleId,
      },
    });
  }

  async updateArticleComment(
    commentId: number,
    data: UpdateCommentDto,
  ): Promise<ArticleComment> {
    return prisma.articleComment.update({
      where: { id: commentId },
      data,
    });
  }

  async deleteArticleComment(commentId: number): Promise<void> {
    await prisma.articleComment.delete({
      where: { id: commentId },
    });
  }
}
