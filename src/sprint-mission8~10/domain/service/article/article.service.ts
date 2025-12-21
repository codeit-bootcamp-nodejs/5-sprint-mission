import { IArticleService } from "../../../inbound/port/services/article/article.service.interface";
import { CreateArticleDto, DeleteArticleDto, GetArticleDto, GetArticleListDto, GetLikedArticlesDto, UpdateArticleDto } from "../../../inbound/requests/article/article.req.schemas";
import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { ArticleKeys, Sort } from "../../../types/query";
import { ArticleEntity, PersistArticleEntity } from "../../entity/article.entity";
import { UserLikesArticleEntity } from "../../entity/like/user-likes-article.entity";
import { IArticleRepo } from "../../port/repo/article/article.repo.interface";
import { IUserLikesArticleRepo } from "../../port/repo/like/user-likes-article.repo.interface";

export class ArticleService implements IArticleService {
  constructor(
    private readonly _articleRepo: IArticleRepo,
    private readonly _userLikesArticleRepo: IUserLikesArticleRepo
  ) { }
  async getArticle(dto: GetArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._articleRepo.findArticleById(dto.articleId);
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

    const foundArticleList = await this._articleRepo.findArticleList(
      offset,
      limit,
      orderBy,
    );

    return foundArticleList;
  };

  async likeArticle(dto: GetLikedArticlesDto): Promise<void> {
    const foundArticle = await this._articleRepo.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    const likeArticleEntity = UserLikesArticleEntity.createNew({ userId: dto.userId, articleId: dto.articleId });

    await this._userLikesArticleRepo.create(likeArticleEntity);
  };

  async unlikeArticle(dto: GetLikedArticlesDto): Promise<void> {
    const foundArticle = await this._articleRepo.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }

    await this._userLikesArticleRepo.delete(dto.userId, dto.articleId);
  };

  async createArticle(dto: CreateArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._articleRepo.findArticleByTitle(dto.title);
    if (foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_ALREADY_EXIST });
    }
    const article = ArticleEntity.createNew(dto);

    const createdArticle = await this._articleRepo.create(article);

    return createdArticle;
  };

  async updateArticle(dto: UpdateArticleDto): Promise<PersistArticleEntity> {
    const foundArticle = await this._articleRepo.findArticleById(dto.articleId);
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

    const updatedArticle = await this._articleRepo.update(foundArticle);

    return updatedArticle;
  };

  async deleteArticle(dto: DeleteArticleDto): Promise<void> {
    const foundArticle = await this._articleRepo.findArticleById(dto.articleId);
    if (!foundArticle) {
      throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }
    if (dto.userId !== foundArticle.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_ARTICLE_OWNER });
    }
    await this._articleRepo.delete(dto.articleId);
  };
}
