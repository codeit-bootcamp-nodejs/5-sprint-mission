import { ArticleReqDto } from "../../../01-inbound/request/article.request";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ArticleResDto } from "../../../01-inbound/response/article.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { IArticleCommandRepository } from "../../port/repositories/command/I.article.repository";
import { Article } from "../entity/article";

export const createArticleCommandService = (
  articleCommandRepository: IArticleCommandRepository,
  notificationEventBus: INotificationEventBus
) => {

  const createArticle = async (dto: ArticleReqDto) => {
    const articleEntity = Article.createNew(dto);
    const article = await articleCommandRepository.save(articleEntity);
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
    const foundArticle = await articleCommandRepository.findById(id);
    if (foundArticle.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 글 수정
    const article = Article.createNew(dto);
    const updatedArticle = await articleCommandRepository.update(foundArticle, article);
    return ArticleResDto(updatedArticle);
  };

  const deleteArticle = async (id: string, userId: string) => {
    // 기존 글 조회
    const article = await articleCommandRepository.findById(id);
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
    await articleCommandRepository.remove(id);
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export type ArticleCommandServiceType = ReturnType<typeof createArticleCommandService>;
