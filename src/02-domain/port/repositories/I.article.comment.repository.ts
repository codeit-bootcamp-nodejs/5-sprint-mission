import { ArticleCommentResDto } from "../../../01-inbound/response/article.comment.res.dto";
import { PersistedArticleComment } from "../../entity/article.comment.entity";

export interface IArticleCommentRepository {
    save(userId: string, articleId: string, content: string): Promise<PersistedArticleComment>
    findArticleComments(articleId: string): Promise<PersistedArticleComment[]>;
    findArticleComment(commentId: string): Promise<PersistedArticleComment>;
    deleteArticleComment(commentId: string): void;
    update(entity: PersistedArticleComment): Promise<PersistedArticleComment>
}
