import { PrismaClient } from "@prisma/client";
import { BaseRepo } from "./base.repo";
import { ProductMapper } from "./mapper/product.mapper";
import { ArticleMapper } from "./mapper/article.mapper";
import { CommentMapper } from "./mapper/comment.mapper";
import { CommentKeys, QueryType } from "../types/query";
import { CommentEntity } from "../03-domain/entity/comment.entity";
import { ICommentRepo } from "../03-domain/port/repo/i.comment.repo";


export type CommentListQueryType = QueryType<CommentKeys> & {
  productId?: string;
  articleId?: string;
}

export type BaseCommentParamsType = {
  articleId?: string;
  productId?: string;
}
export type CountCommentParamsType = BaseCommentParamsType
export type FindCommentParamsType = BaseCommentParamsType & {
  commentId: number;
}
export type DeleteCommentParamsType = BaseCommentParamsType & {
  commentId: number;
}
export class CommentRepo extends BaseRepo implements ICommentRepo {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  findProductById = async (id: string) => {
    const product = await this._prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };

  findArticleById = async (id: string) => {
    const article = await this._prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toEntity(article) : null;
  };

  findCommentById = async ({ articleId, productId, commentId }: FindCommentParamsType) => {
    if (articleId) {
      const comment = await this._prisma.articleComment.findUnique({
        where: {
          articleId,
          id: commentId,
        },
      });
      return comment ? CommentMapper.toEntity(comment) : null;
    }
    if (productId) {
      const comment = await this._prisma.productComment.findUnique({
        where: {
          productId,
          id: commentId,
        },
      });
      return comment ? CommentMapper.toEntity(comment) : null;
    }
  };

  findCommentList = async <T extends CommentKeys>({
    productId,
    articleId,
    cursor,
    limit,
    orderBy,
  }: CommentListQueryType) => {
    if (productId) {
      const commentList = await this._prisma.productComment.findMany({
        where: { productId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          [orderBy.field]: orderBy.sort
        }
      });
      return commentList.map((comment) => CommentMapper.toEntity(comment));
    }

    if (articleId) {
      const commentList = await this._prisma.articleComment.findMany({
        where: { articleId },
        take: limit,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          [orderBy.field]: orderBy.sort
        },
      });
      return commentList.map((comment) => CommentMapper.toEntity(comment));
    }
  };

  create = async (entity: CommentEntity) => {
    if (entity.articleId) {
      const comment = await this._prisma.articleComment.create({
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
      const comment = await this._prisma.productComment.create({
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

  update = async (entity: CommentEntity) => {
    if (entity.articleId) {
      const updatedcomment = await this._prisma.articleComment.update({
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
      const updatedcomment = await this._prisma.productComment.update({
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

  delete = async ({ articleId, productId, commentId }: DeleteCommentParamsType) => {
    if (articleId) {
      const deletedComment = await this._prisma.articleComment.delete({
        where: {
          id: commentId,
          articleId,
        },
      });
    }

    if (productId) {
      const deletedComment = await this._prisma.productComment.delete({
        where: {
          id: commentId,
          productId,
        },
      });
    }
  };

  count = async ({ articleId, productId }: CountCommentParamsType) => {
    let totalCount = 0;

    if (productId) {
      totalCount = await this._prisma.productComment.count({
        where: { productId },
      });
    }

    if (articleId) {
      totalCount = await this._prisma.articleComment.count({
        where: { articleId },
      });
    }

    return totalCount;
  };
}
