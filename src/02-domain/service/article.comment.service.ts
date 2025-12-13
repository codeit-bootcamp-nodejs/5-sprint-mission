import { NotificationType } from "@prisma/client";
import { ArticleCommentDto } from "../../01-inbound/request/req.validator";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.response";
import { ArticleComment } from "../entity/article.comment.entity";
import { NotificationEntity } from "../entity/notification";
import { IBaseRepository } from "../port/I.base.repository";
import { ArticleCommentEventBusType } from "../../application/event.bus";





export const createArticleCommentService = (
    repos: IBaseRepository, eventBus: ArticleCommentEventBusType
) => {

    const createArticleComment = async (dto: ArticleCommentDto) => {
        const { articleId, userId, content } = dto;

        // 글 생성자 조회
        const articleEntity = await repos.article.findById(articleId);
        if (!articleEntity) {
            throw new Error("글이 존재하지 않습니다.");
        }

        // 댓글 생성
        const articleCommentEntity = ArticleComment.createNew({ articleId, content, userId })
        const articleComment = await repos.articleComment.save(articleCommentEntity);


        // 댓글 알림 생성
        const notificationEntity = NotificationEntity.createNew({
            type: NotificationType.ARTICLE_COMMENT,
            message: articleComment.content,
            read: false,
            senderId: articleComment.userId,
            receiverId: articleEntity.userId
        })
        const notification = await repos.notification.create(notificationEntity);
        eventBus.publish(notification);


        return new ArticleCommentResDto(articleComment);
    }

    const getArticleComments = async (articleId: string) => {
        const articleCommentResDtos = await repos.articleComment.findArticleComments(articleId);
        return articleCommentResDtos.map(dto => new ArticleCommentResDto(dto));
    }

    const updateArticleComment = async (dto: ArticleCommentDto) => {
        const { articleId, commentId, content, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }


        const foundArticleComment = await repos.articleComment.findArticleComment(commentId);
        if (!foundArticleComment) {
            throw new Error('Article comments not found.');
        }
        if (foundArticleComment.userId !== userId) {
            throw new Error('Unauthorized to update this comment.');
        }

        const newArticleComment = ArticleComment.createNew({
            articleId,
            content,
            userId
        });
        const articleCommentResDto = await repos.articleComment.update(foundArticleComment, newArticleComment);
        return new ArticleCommentResDto(articleCommentResDto);
    }

    const deleteArticleComments = async (articleId: string, commentId: string, userId: string) => {
        const articleComment = await repos.articleComment.findArticleComment(commentId);
        if (!articleComment) {
            throw new Error('Article comments not found.');
        }

        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to delete this comment.');
        }

        await repos.articleComment.deleteArticleComment(commentId);
    }


    return {
        createArticleComment,
        getArticleComments,
        updateArticleComment,
        deleteArticleComments
    }
}

export type ArticleCommentServiceType = ReturnType<typeof createArticleCommentService>;