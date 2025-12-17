import { BaseRepo } from "../base.repo";
import { NewArticleEntity, PersistArticleEntity } from "../../../domain/entity/article.entity";
import { ArticleMapper } from "../../mapper/article.mapper";
import { IArticleRepo } from "../../../domain/port/repo/article/article.repo.interface";
import { ArticleKeys, Sort } from "../../../types/query";

export class ArticleRepo extends BaseRepo implements IArticleRepo {
  async findArticleByTitle(title: string): Promise<PersistArticleEntity | null> {
    const article = await this._prisma.article.findUnique({
      where: { title },
    });
    if (!article) return null;

    return article ? ArticleMapper.toPersistEntity(article) : null;
  };

  async findArticleById(id: string): Promise<PersistArticleEntity | null> {
    const article = await this._prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toPersistEntity(article) : null;
  };

  async findArticleLike(userId: string, articleId: string): Promise<PersistArticleEntity | null> {
    const article = await this._prisma.article.findUnique({
      where: {
        id: articleId,
        ArticleLike: {
          some: {
            userId
          }
        }
      },
    });

    if (!article) {
      return null;
    }

    return ArticleMapper.toPersistEntity(article);
  };

  async findUserLikeArticles(userId: string, offset: number, limit: number): Promise<PersistArticleEntity[] | null> {
    const userLikeArticles = await this._prisma.articleLike.findMany({
      where: {
        userId
      },
      skip: offset,
      take: limit,
      include: {
        article: true,
      },
    });

    if (!userLikeArticles || userLikeArticles.length === 0) return null;


    return userLikeArticles.map(userLikeArticle => ArticleMapper.toPersistEntity(userLikeArticle.article));

  };

  async findArticleList(offset: number, limit: number, orderBy: { field: ArticleKeys, sort: Sort }): Promise<PersistArticleEntity[]> {
    const articleList = await this._prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort
      },
    });

    return articleList.map((article) => ArticleMapper.toPersistEntity(article));
  };

  async create(entity: NewArticleEntity): Promise<PersistArticleEntity> {
    const article = await this._prisma.article.create({
      data: {
        ...ArticleMapper.toCreateData(entity),
      },
    });
    return ArticleMapper.toPersistEntity(article);
  };

  async update(entity: PersistArticleEntity): Promise<PersistArticleEntity> {
    const updatedarticle = await this._prisma.article.update({
      where: { id: entity.id },
      data: {
        ...ArticleMapper.toUpdateData(entity),
        updatedAt: new Date(),
      },
    });

    return ArticleMapper.toPersistEntity(updatedarticle);
  };

  async delete(articleId: string): Promise<void> {
    await this._prisma.article.delete({
      where: { id: articleId },
    });
  };

  async count(): Promise<number> {
    const totalCount = await this._prisma.article.count();

    return totalCount;
  };
}
