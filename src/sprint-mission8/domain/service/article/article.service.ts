import { IArticleService } from "../../../inbound/port/services/article/article.service.interface";
import { CreateArticleDto, DeleteArticleDto, GetArticleDto, GetArticleListDto, GetLikedArticlesDto, UpdateArticleDto } from "../../../inbound/requests/article/article.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { ArticleKeys, Sort } from "../../../types/query";
import { ArticleEntity, PersistArticleEntity } from "../../entity/article.entity";
import { UserLikesArticleEntity } from "../../entity/like/user-likes-article.entity";
import { BaseService } from "../base.service";

export class ArticleService extends BaseService implements IArticleService {
  async getArticle(dto: GetArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._repos.article.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    return foundArticle;
  };

  async getArticleList(dto: GetArticleListDto): Promise<PersistArticleEntity[]> {
    const { offset, limit, sort } = dto;
    const orderBy: { field: ArticleKeys; sort: Sort; } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : sort === "title-asc"
          ? {
            field: "title",
            sort: "asc"
          }
          : {
            field: "title",
            sort: "desc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const articleTotalCount = await this._repos.article.count();
    if (articleTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: articleTotalCount });
    }

    const foundArticleList = await this._repos.article.findArticleList(
      offset,
      limit,
      orderBy,
    );

    return foundArticleList;
  };

  async likeArticle(dto: GetLikedArticlesDto): Promise<void> {
    const foundArticle = await this._repos.article.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    const likeArticleEntity = UserLikesArticleEntity.createNew({ userId: dto.userId, articleId: dto.articleId });

    await this._repos.userLikesArticle.create(likeArticleEntity);
  };

  async unlikeArticle(dto: GetLikedArticlesDto): Promise<void> {
    const foundArticle = await this._repos.article.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    await this._repos.userLikesArticle.delete(dto.userId, dto.articleId);
  };

  async createArticle(dto: CreateArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._repos.article.findArticleByTitle(dto.title);
    if (foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_ALREADY_EXIST });
    }
    const article = ArticleEntity.createNew(dto);

    const createdArticle = await this._repos.article.create(article);

    return createdArticle;
  };

  async updateArticle(dto: UpdateArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._repos.article.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    if (dto.userId !== foundArticle.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_ARTICLE_OWNER });
    }
    foundArticle.update({
      title: dto.title,
      content: dto.content,
      image: dto.image
    });

    const updatedArticle = await this._repos.article.update(foundArticle);

    return updatedArticle;
  };

  async deleteArticle(dto: DeleteArticleDto): Promise<void> {
    const foundArticle = await this._repos.article.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }
    if (dto.userId !== foundArticle.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_ARTICLE_OWNER });
    }
    await this._repos.article.delete(dto.articleId);
  };
}
