import {
  NewArticleComment,
  PersistedArticleComment,
} from "../../entity/article.comment";

export interface IArticleCommentRepository {
  save(entity: NewArticleComment): Promise<PersistedArticleComment>;

  findAll(articleId: string): Promise<PersistedArticleComment[]>;

  findById(commentId: string): Promise<PersistedArticleComment>;

  update(
    foundEntity: PersistedArticleComment,
    newEntity: NewArticleComment,
  ): Promise<PersistedArticleComment>;

  remove(commentId: string): void;
}
