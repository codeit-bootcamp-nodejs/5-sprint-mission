import { ArticleCommentResDto } from "../../../01-inbound/response/article.comment.res.dto";

export interface IArticleCommentRepository {
    save(userId: string, articleId: string, content: string): Promise<ArticleCommentResDto>
    findArticleComments(articleId: string): Promise<ArticleCommentResDto[]>;
    deleteArticleComment(commentId: string): void;
    update(userId: string, articleId: string, commentId: string, content: string): Promise<ArticleCommentResDto>
}
