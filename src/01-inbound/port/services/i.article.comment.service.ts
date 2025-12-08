import { ArticleCommentRequest } from "../../request/req.validator";
import { ArticleCommentResDto } from "../../response/article.comment.res.dto";

export interface IArticleCommentService {
    createArticleComment(dto: ArticleCommentRequest): Promise<ArticleCommentResDto>
    getArticleComments(articleId: string): Promise<ArticleCommentResDto[]>;
    deleteArticleComments(commentId: string): void;
    updateArticleComment(dto: ArticleCommentRequest): Promise<ArticleCommentResDto>
}