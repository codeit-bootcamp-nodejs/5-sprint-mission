import { IRedisExternal } from "../../port/externals/I.redis.external";
import { IArticleCommentCommandRepository } from "../../port/repositories/command/I.article.comment.repository";
import { IArticleCommentQueryRepository } from "../../port/repositories/query/I.article.comment.query.repository";

export const createArticleCommentQueryService = (
  redisExternal: IRedisExternal,
  articleCommentQueryRepository: IArticleCommentQueryRepository,
) => {
  const getArticleComments = async (articleId: string) => {
    const articleComments =
      await articleCommentQueryRepository.findAll(articleId);
    return articleComments;
  };

  return {
    getArticleComments,
  };
};

export type ArticleCommentQueryServiceType = ReturnType<
  typeof createArticleCommentQueryService
>;
