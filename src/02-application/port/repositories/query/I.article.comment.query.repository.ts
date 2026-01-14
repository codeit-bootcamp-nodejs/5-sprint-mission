import { ArticleCommentView } from "../../../query/view/article.comment.view";

export interface IArticleCommentQueryRepository {
  findAll(id: string): Promise<ArticleCommentView[]>;
}
