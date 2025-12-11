import { NewArticleComment, PersistedArticleComment } from "../../entity/article.comment.entity";

export interface IArticleCommentRepository {
    save(entity: NewArticleComment): Promise<PersistedArticleComment>
    findArticleComments(articleId: string): Promise<PersistedArticleComment[]>;
    findArticleComment(commentId: string): Promise<PersistedArticleComment>;
    deleteArticleComment(commentId: string): void;
    update(foundEntity: PersistedArticleComment, newEntity: NewArticleComment): Promise<PersistedArticleComment>
}
