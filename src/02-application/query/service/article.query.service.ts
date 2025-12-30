import { ArticleReqDto } from "../../../01-inbound/request/article.request";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ArticleResDto } from "../../../01-inbound/response/article.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../../shared/exception/exception";
import { Article } from "../../command/entity/article";
import { IRedisExternal } from "../../port/externals/I.redis.external";
import { IArticleCommandRepository } from "../../port/repositories/command/I.article.repository";
import { IArticleQueryRepository } from "../../port/repositories/query/I.article.query.repository";
import { ArticleView } from "../view/article.view";

export const createArticleQueryService = (
  redisExternal: IRedisExternal,
  articleQueryRepository: IArticleQueryRepository,
  notificationEventBus: INotificationEventBus,
) => {
  const getAllArticles = async (query: QueryType) => {
    const articles = await articleQueryRepository.findAll(query);
    return articles;
  };

  const getArticle = async (id: string) => {
    const key = `article:${id}`;
    let article: ArticleView | null = null;
    let lock = null;

    // Redis에서 조회
    // 없으면 DB에서 가져와서 redis에 저장 (redis 분산 락)
    const cachedArticle = await redisExternal.get(key);
    if (cachedArticle) {
      article = JSON.parse(cachedArticle);
    } else {
      for (let i = 0; i < 10; i++) {
        lock = await redisExternal.setIfNotExist(`lock:article:${id}`, ".", 3);

        if (lock) {
          // 1명 통과
          const foundArticle = await articleQueryRepository.findById(id);
          await redisExternal.setIfNotExist(key, JSON.stringify(foundArticle));
          article = foundArticle;
          await redisExternal.remove(`lock:article:${id}`);
        } else {
          // 999명 실패
          const cachedArticle = await redisExternal.get(key);
          if (cachedArticle) {
            article = JSON.parse(cachedArticle);
            break;
          }
          console.log(`게시글 조회 재시도 ${i}`);
          await new Promise<void>((resolve) =>
            setTimeout(() => resolve(), 100),
          );
        }
      }
    }

    // 분산 락 시도 끝까지 없다면 DB 조회
    if (!article) {
      const foundArticle = await articleQueryRepository.findById(id);
      await redisExternal.setIfNotExist(key, JSON.stringify(foundArticle));
      article = foundArticle;
    }

    return article;
  };

  return {
    getAllArticles,
    getArticle,
  };
};

export type ArticleQueryServiceType = ReturnType<
  typeof createArticleQueryService
>;
