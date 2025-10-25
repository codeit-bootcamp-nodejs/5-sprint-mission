import { BaseRepo } from "./base.repo.js";
import { ArticleMapper } from "./mapper/article.mapper.js";
import { CommentMapper } from "./mapper/comment.mapper.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class CommentRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }
  findProductById = async (id) => {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };
  findArticleById = async (id) => {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toEntity(article) : null;
  };

  findCommentById = async ({ articleId, productId, commentId }) => {
    if (articleId) {
      const comment = await this.prisma.articleComment.findUnique({
        where: {
          articleId,
          id: commentId,
        },
      });
      return comment ? CommentMapper.toEntity(comment) : null;
    }
    if (productId) {
      const comment = await this.prisma.productComment.findUnique({
        where: {
          productId,
          id: commentId,
        },
      });
      return comment ? CommentMapper.toEntity(comment) : null;
    }
  };

  findCommentList = async ({
    productId,
    articleId,
    cursor,
    limit,
    orderBy,
  }) => {
    if (productId) {
      const commentList = await this.prisma.productComment.findMany({
        where: { productId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [orderBy],
      });
      return commentList.map((comment) => CommentMapper.toEntity(comment));
    }

    if (articleId) {
      const commentList = await this.prisma.articleComment.findMany({
        where: { articleId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [orderBy],
      });
      return commentList.map((comment) => CommentMapper.toEntity(comment));
    }
  };

  create = async (entity) => {
    if (entity.articleId) {
      const comment = await this.prisma.articleComment.create({
        data: {
          ...CommentMapper.toPersistent(entity),
          User: {
            connect: { id: entity.userId },
          },
          Article: {
            connect: { id: entity.articleId },
          },
        },
      });
      return CommentMapper.toEntity(comment);
    }
    if (entity.productId) {
      const comment = await this.prisma.productComment.create({
        data: {
          ...CommentMapper.toPersistent(entity),
          User: {
            connect: { id: entity.userId },
          },
          Product: {
            connect: { id: entity.productId },
          },
        },
      });
      return CommentMapper.toEntity(comment);
    }
  };

  update = async (entity) => {
    if (entity.articleId) {
      const updatedcomment = await this.prisma.articleComment.update({
        where: {
          id: entity.id,
          articleId: entity.articleId,
        },
        data: {
          ...CommentMapper.toPersistent(entity),
          updatedAt: new Date(),
        },
      });

      return CommentMapper.toEntity(updatedcomment);
    }
    if (entity.productId) {
      const updatedcomment = await this.prisma.productComment.update({
        where: {
          id: entity.id,
          productId: entity.productId,
        },
        data: {
          ...CommentMapper.toPersistent(entity),
          updatedAt: new Date(),
        },
      });

      return CommentMapper.toEntity(updatedcomment);
    }
  };

  delete = async ({ articleId, productId, commentId }) => {
    if (articleId) {
      const deletedComment = await this.prisma.articleComment.delete({
        where: {
          id: commentId,
          articleId,
        },
      });
      return deletedComment;
    }

    if (productId) {
      const deletedComment = await this.prisma.productComment.delete({
        where: {
          id: commentId,
          productId,
        },
      });
      return deletedComment;
    }
  };

  count = async ({ articleId, productId }) => {
    let totalCount;
    if (productId) {
      totalCount = await this.prisma.productComment.count({
        where: { productId },
      });
    }

    if (articleId) {
      totalCount = await this.prisma.articleComment.count({
        where: { articleId },
      });
    }
    return totalCount;
  };
}
