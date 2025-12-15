import { Article } from "../entity/article";
import { IBaseRepository } from "../port/I.base.repository";
import { ArticleResDto } from "../../01-inbound/response/article.response";
import { ArticleReqDto } from "../../01-inbound/request/article.request";
import { QueryType } from "../../01-inbound/request/query.request";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";
import { IEventBus } from "../../01-inbound/port/I.eventbus";

export const createArticleService = (repos: IBaseRepository, eventBuses: IEventBus) => {
  const getAllArticles = async (query: QueryType) => {
    const articleEntities = await repos.article.findAll(query);
    const articleResDtos = articleEntities.map((entity) =>
      ArticleResDto(entity),
    );
    return articleResDtos;
  };

  const getArticle = async (id: string) => {
    const articleEntity = await repos.article.findById(id);
    return ArticleResDto(articleEntity);
  };

  const createArticle = async (dto: ArticleReqDto) => {
    const articleEntity = Article.createNew(dto);
    const article = await repos.article.save(articleEntity);
    return ArticleResDto(article);
  };

  const updateArticle = async (dto: ArticleReqDto) => {
    const { userId, id } = dto;
    if (!id) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL
      })
    }

    // 기존 글 조회
    const foundArticle = await repos.article.findById(id);
    if (foundArticle.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 글 수정
    const article = Article.createNew(dto);
    const updatedArticle = await repos.article.update(foundArticle, article);
    return ArticleResDto(updatedArticle);
  };

  const deleteArticle = async (id: string, userId: string) => {
    // 기존 글 조회
    const article = await repos.article.findById(id);
    if (!article) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }
    if (article.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 글 삭제
    await repos.article.remove(id);
  };

  return {
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export type ArticleServiceType = ReturnType<typeof createArticleService>;
