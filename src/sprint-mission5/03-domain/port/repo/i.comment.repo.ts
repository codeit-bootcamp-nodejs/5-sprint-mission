import { CommentKeys, CommentListQueryType, CountCommentParamsType, DeleteCommentParamsType, FindCommentParamsType } from "../../../04-repo/comment.repo";
import { ArticleEntity } from "../../entity/article.entity";
import { CommentEntity } from "../../entity/comment.entity";
import { ProductEntity } from "../../entity/product.entity";

export interface ICommentRepo {
  findProductById:(id: string) => Promise<ProductEntity | null>;
  findArticleById:(id: string) => Promise<ArticleEntity | null>;
  findCommentById:({ articleId, productId, commentId }: FindCommentParamsType) => Promise<CommentEntity | null | undefined>;
  findCommentList: <T extends CommentKeys>({ productId, articleId, cursor, limit, orderBy, }: CommentListQueryType<T>) => Promise<CommentEntity[] | undefined>;
  create: (entity: CommentEntity) => Promise<CommentEntity | undefined>;
  update: (entity: CommentEntity) => Promise<CommentEntity | undefined>;
  delete:({ articleId, productId, commentId }: DeleteCommentParamsType) => Promise<void>;
  count: ({ articleId, productId }: CountCommentParamsType) => Promise<number | undefined>;
}