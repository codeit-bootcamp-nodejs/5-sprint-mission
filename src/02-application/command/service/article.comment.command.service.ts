import { NotificationType } from "@prisma/client";
import { ArticleCommentDto } from "../../../01-inbound/request/article.comment.request";
import { ArticleCommentResDto } from "../../../01-inbound/response/article.comment.response";
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../../shared/exception/exception";
import { IArticleCommentCommandRepository } from "../../port/repositories/command/I.article.comment.repository";
import { IArticleCommandRepository } from "../../port/repositories/command/I.article.repository";
import { INotificationCommandRepository } from "../../port/repositories/command/I.notification.repository";
import { ArticleComment } from "../entity/article.comment";
import { Notification } from "../entity/notification";

export const createArticleCommentCommandService = (
  articleCommandRepository: IArticleCommandRepository,
  articleCommentCommandRepository: IArticleCommentCommandRepository,
  notificationCommandRepository: INotificationCommandRepository,
  notificationBus: INotificationEventBus,
) => {
  const createArticleComment = async (dto: ArticleCommentDto) => {
    const { articleId, userId, content } = dto;

    // 글 조회
    const articleEntity = await articleCommandRepository.findById(articleId);
    if (!articleEntity) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }

    // 댓글 생성
    const articleCommentEntity = ArticleComment.createNew({
      articleId,
      content,
      userId,
    });
    const articleComment =
      await articleCommentCommandRepository.save(articleCommentEntity);

    // 댓글 알림 생성 (자신의 글이 아닐 때만 알림)
    if (userId !== articleEntity.userId) {
      const notifcationEntity = Notification.createNew({
        type: NotificationType.ARTICLE_COMMENT,
        message: "내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.",
        read: false,
        senderId: userId,
        receiverId: articleEntity.userId,
      });
      const notification =
        await notificationCommandRepository.create(notifcationEntity);
      notificationBus.publish(notification);
    }

    return ArticleCommentResDto(articleComment);
  };

  const updateArticleComment = async (dto: ArticleCommentDto) => {
    const { articleId, commentId, content, userId } = dto;
    if (!commentId) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 댓글 조회
    const foundArticleComment =
      await articleCommentCommandRepository.findById(commentId);
    if (!foundArticleComment) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }
    if (foundArticleComment.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    // 댓글 수정
    const articleComment = ArticleComment.createNew({
      articleId,
      content,
      userId,
    });
    const articleCommentResDto = await articleCommentCommandRepository.update(
      foundArticleComment,
      articleComment,
    );
    return ArticleCommentResDto(articleCommentResDto);
  };

  const deleteArticleComments = async (
    articleId: string,
    commentId: string,
    userId: string,
  ) => {
    // 댓글 조회
    const articleComment =
      await articleCommentCommandRepository.findById(commentId);
    if (!articleComment) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
    }
    if (articleComment.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
    }

    // 댓글 삭제
    await articleCommentCommandRepository.remove(commentId);
  };

  return {
    createArticleComment,
    updateArticleComment,
    deleteArticleComments,
  };
};

export type ArticleCommentCommandServiceType = ReturnType<
  typeof createArticleCommentCommandService
>;
