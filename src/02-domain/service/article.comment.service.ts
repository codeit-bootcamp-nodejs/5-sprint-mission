import { NotificationType } from "@prisma/client";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.response";
import { Notification } from "../entity/notification";

import { ArticleCommentDto } from "../../01-inbound/request/article.comment.request";
import { ArticleComment } from "../entity/article.comment";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";


import { IArticleCommentRepository } from "../port/repositories/I.article.comment.repository";
import { IArticleRepository } from "../port/repositories/I.article.repository";
import { INotificationEventBus } from "../../shared/eventbus/ports/I.notification.eventbus";
import { INotificationRepository } from "../port/repositories/I.notification.repository";

export const createArticleCommentService = (
  articleRepository: IArticleRepository,
  articleCommentRepository: IArticleCommentRepository,
  notificationRepository: INotificationRepository,
  notificationBus: INotificationEventBus
) => {
  const createArticleComment = async (dto: ArticleCommentDto) => {
    const { articleId, userId, content } = dto;

    // 글 조회
    const articleEntity = await articleRepository.findById(articleId);
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
      await articleCommentRepository.save(articleCommentEntity);


    // 댓글 알림 생성 (자신의 글이 아닐 때만 알림)
    if (userId !== articleEntity.userId) {
      const notifcationEntity = Notification.createNew({
        type: NotificationType.ARTICLE_COMMENT,
        message: "내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.",
        read: false,
        senderId: userId,
        receiverId: articleEntity.userId,
      });
      const notification = await notificationRepository.create(notifcationEntity);
      notificationBus.publish(notification);
    }

    return ArticleCommentResDto(articleComment);
  };

  const getArticleComments = async (articleId: string) => {
    const articleComments = await articleCommentRepository.findAll(articleId);
    return articleComments.map((dto) => ArticleCommentResDto(dto));
  };

  const updateArticleComment = async (dto: ArticleCommentDto) => {
    const { articleId, commentId, content, userId } = dto;
    if (!commentId) {
      throw BusinessException({
        type: BusinessExceptionType.WRONG_URL,
      });
    }

    // 댓글 조회
    const foundArticleComment = await articleCommentRepository.findById(commentId);
    if (!foundArticleComment) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }
    if (foundArticleComment.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 댓글 수정
    const articleComment = ArticleComment.createNew({
      articleId,
      content,
      userId,
    });
    const articleCommentResDto = await articleCommentRepository.update(
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
    const articleComment = await articleCommentRepository.findById(commentId);
    if (!articleComment) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }
    if (articleComment.userId !== userId) {
      throw BusinessException({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST
      })
    }

    // 댓글 삭제
    await articleCommentRepository.remove(commentId);
  };

  return {
    createArticleComment,
    getArticleComments,
    updateArticleComment,
    deleteArticleComments,
  };
};

export type ArticleCommentServiceType = ReturnType<
  typeof createArticleCommentService
>;
