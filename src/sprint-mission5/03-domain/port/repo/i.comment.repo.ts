import { CommentListQueryType, CountCommentParamsType, DeleteCommentParamsType, FindCommentParamsType } from "../../../04-repo/comment.repo";
import { CommentKeys } from "../../../types/query";
import { ArticleEntity } from "../../entity/article.entity";
import { CommentEntity, PersistedCommentEntity } from "../../entity/comment.entity";
import { ProductEntity } from "../../entity/product.entity";

export interface ICommentRepo {
  findProductById: (id: string) => Promise<ProductEntity | null>;
  findArticleById: (id: string) => Promise<ArticleEntity | null>;
  findCommentById: ({ articleId, productId, commentId }: FindCommentParamsType) => Promise<PersistedCommentEntity | null>;
  findCommentList: ({ productId, articleId, cursor, limit, orderBy, }: CommentListQueryType) => Promise<PersistedCommentEntity[]>;
  create: (entity: CommentEntity) => Promise<PersistedCommentEntity>;
  update: (entity: CommentEntity) => Promise<PersistedCommentEntity>;
  delete: ({ articleId, productId, commentId }: DeleteCommentParamsType) => Promise<void>;
  count: ({ articleId, productId }: CountCommentParamsType) => Promise<number>;
}