import { NotificationType } from "@prisma/client";
import { ArticleCommentDto } from "../../01-inbound/request/req.validator";
import { ArticleCommentResDto } from "../../01-inbound/response/article.comment.response";
import { EventBus } from "../../application/event.bus";
import { Authenticator } from "../../external/authenticator";
import { ArticleComment } from "../entity/article.comment.entity";
import { NotificationEntity } from "../entity/notification";
import { IBaseRepository } from "../port/I.base.repository";





export class ArticleCommentService {
    #repos
    #eventBus

    constructor(repos: IBaseRepository, eventBus: EventBus) {
        this.#repos = repos;
        this.#eventBus = eventBus;
    }


    async createArticleComment(dto: ArticleCommentDto) {
        const { articleId, userId, content } = dto;

        // 글 생성자 조회
        const articleEntity = await this.#repos.article.findById(articleId);
        if (!articleEntity) {
            throw new Error("글이 존재하지 않습니다.");
        }

        // 댓글 생성
        const articleCommentEntity = ArticleComment.createNew({ articleId, content, userId })
        const articleComment = await this.#repos.articleComment.save(articleCommentEntity);


        // 댓글 알림 생성
        const notificationEntity = NotificationEntity.createNew({
            type: NotificationType.ARTICLE_COMMENT,
            message: articleComment.content,
            read: false,
            senderId: articleComment.userId,
            receiverId: articleEntity.userId
        })
        const notification = await this.#repos.notification.create(notificationEntity);
        this.#eventBus.publish(notification);

    
        return new ArticleCommentResDto(articleComment);
    }

    async getArticleComments(articleId: string) {
        const articleCommentResDtos = await this.#repos.articleComment.findArticleComments(articleId);
        return articleCommentResDtos.map(dto => new ArticleCommentResDto(dto));
    }

    async updateArticleComment(dto: ArticleCommentDto) {
        const { articleId, commentId, content, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }


        const articleComment = await this.#repos.articleComment.findArticleComment(commentId);
        if (!articleComment) {
            throw new Error('Article comments not found.');
        }
        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to update this comment.');
        }

        articleComment.update(content);
        const articleCommentResDto = await this.#repos.articleComment.update(articleComment);
        return new ArticleCommentResDto(articleCommentResDto);
    }

    async deleteArticleComments(articleId: string, commentId: string, userId: string) {
        const articleComment = await this.#repos.articleComment.findArticleComment(commentId);
        if (!articleComment) {
            throw new Error('Article comments not found.');
        }

        if (articleComment.userId !== userId) {
            throw new Error('Unauthorized to delete this comment.');
        }

        await this.#repos.articleComment.deleteArticleComment(commentId);
    }

}