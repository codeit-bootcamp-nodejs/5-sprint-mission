import { ArticleCommentDto } from "../../request/req.validator";
import { ArticleCommentResDto } from "../../response/article.comment.res.dto";

export interface IArticleCommentService {
    createArticleComment(dto: ArticleCommentDto): Promise<ArticleCommentResDto>
    getArticleComments(articleId: string): Promise<ArticleCommentResDto[]>;
    deleteArticleComments(articleId: string, commentId: string, userId: string): void;
    updateArticleComment(dto: ArticleCommentDto): Promise<ArticleCommentResDto>
}