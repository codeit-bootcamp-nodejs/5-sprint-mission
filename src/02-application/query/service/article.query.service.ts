import { ArticleReqDto } from "../../../01-inbound/request/article.request";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ArticleResDto } from "../../../01-inbound/response/article.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { Article } from "../../command/entity/article";
import { IArticleCommandRepository } from "../../port/repositories/command/I.article.repository";
import { IArticleQueryRepository } from "../../port/repositories/query/I.article.query.repository";




export const createArticleQueryService = (
  articleQueryRepository: IArticleQueryRepository,
  notificationEventBus: INotificationEventBus
) => {
  const getAllArticles = async (query: QueryType) => {
    const articles = await articleQueryRepository.findAll(query);
    return articles;
  };

  const getArticle = async (id: string) => {
    const article = await articleQueryRepository.findById(id);
    return article
  }
  return {
    getAllArticles,
    getArticle
  };
};


export type ArticleQueryServiceType = ReturnType<typeof createArticleQueryService>;
