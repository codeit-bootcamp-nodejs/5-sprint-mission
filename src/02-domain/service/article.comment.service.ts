import { NotificationType } from "@prisma/client";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.response";
import { Notification } from "../entity/notification";
import { IBaseRepository } from "../port/I.base.repository";
import { ArticleCommentDto } from "../../01-inbound/request/article.comment.request";
import { IEventBus } from "../../01-inbound/port/I.eventbus";
import { ArticleComment } from "../entity/article.comment";
import { BusinessException, BusinessExceptionType } from "../../common/exception/exception";

export const createArticleCommentService = (
  repos: IBaseRepository,
  eventBus: IEventBus,
) => {
  const createArticleComment = async (dto: ArticleCommentDto) => {
    const { articleId, userId, content } = dto;

    // 글 조회
    const articleEntity = await repos.article.findById(articleId);
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
      await repos.articleComment.save(articleCommentEntity);

    // 댓글 알림 생성 (자신의 글이 아닐 때만 알림)
    if (userId !== articleEntity.userId) {
      const notificationEntity = Notification.createNew({
        type: NotificationType.ARTICLE_COMMENT,
        message: "내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.",
        read: false,
        senderId: userId,
        receiverId: articleEntity.userId,
      });
      const notification = await repos.notification.create(notificationEntity);
      eventBus.notification.publish(notification);
    }

    return ArticleCommentResDto(articleComment);
  };

  const getArticleComments = async (articleId: string) => {
    const articleComments = await repos.articleComment.findAll(articleId);
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
    const foundArticleComment = await repos.articleComment.findById(commentId);
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
    const articleCommentResDto = await repos.articleComment.update(
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
    const articleComment = await repos.articleComment.findById(commentId);
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
    await repos.articleComment.remove(commentId);
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
