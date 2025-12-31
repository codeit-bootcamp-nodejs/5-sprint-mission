import {
  NewArticleCommentEntity,
  PersitstArticleCommentEntity,
} from "../../../domain/entity/comment/article-comment.entity";
import { IArticleCommentRepo } from "../../../domain/port/repo/article/article-comment.repo.interface";
import { CommentKeys, Sort } from "../../../types/query";
import { ArticleCommentMapper } from "../../mapper/comment/article.comment.mapper";
import { BaseRepo } from "../base.repo";

export class ArticleCommentRepo
  extends BaseRepo
  implements IArticleCommentRepo
{
  async findCommentById(
    id: number,
  ): Promise<PersitstArticleCommentEntity | null> {
    const articleComment = await this._prisma.articleComment.findUnique({
      where: { id },
    });
    return articleComment
      ? ArticleCommentMapper.toPersistEntity(articleComment)
      : null;
  }

  async findCommentList(
    articleId: string,
    cursor: number,
    limit: number,
    orderBy: { field: CommentKeys; sort: Sort },
  ): Promise<PersitstArticleCommentEntity[] | null> {
    const commentList = await this._prisma.articleComment.findMany({
      where: { articleId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        [orderBy.field]: orderBy.sort,
      },
    });

    return commentList.map((comment) =>
      ArticleCommentMapper.toPersistEntity(comment),
    );
  }

  async create(
    entity: NewArticleCommentEntity,
  ): Promise<PersitstArticleCommentEntity> {
    const comment = await this._prisma.articleComment.create({
      data: {
        ...ArticleCommentMapper.toCreateData(entity),
      },
      include: {
        Article: {
          select: {
            userId: true,
          },
        },
      },
    });

    return ArticleCommentMapper.toPersistEntity(
      {
        ...comment,
        userId: comment.userId,
      },
      comment.Article.userId,
    );
  }

  async update(
    entity: PersitstArticleCommentEntity,
  ): Promise<PersitstArticleCommentEntity> {
    const updatedcomment = await this._prisma.articleComment.update({
      where: {
        id: entity.id,
      },
      data: {
        ...ArticleCommentMapper.toUpdateData(entity),
        updatedAt: new Date(),
      },
    });

    return ArticleCommentMapper.toPersistEntity(updatedcomment);
  }

  async delete(commentId: number): Promise<void> {
    await this._prisma.articleComment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async count(articleId: string): Promise<number> {
    return await this._prisma.articleComment.count({
      where: { articleId },
    });
  }
}
