import { IRepos } from "../../outbound/repos";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { BaseQueryType, CommentKeys, CommentSort, Sort } from "../../types/query";
import { CommentEntity, PersistedCommentEntity } from "../entity/comment/comment.entity";
import { BaseService } from "./base.service";

export interface ICommentService {
  getCommentList: ({ articleId, productId, cursor, limit, sort }: BaseCommentQueryType) => Promise<PersistedCommentEntity[]>;
  createComment: ({ userId, articleId, productId, content }: CreateCommentParamsType) => Promise<PersistedCommentEntity>;
  updateComment: ({ userId, articleId, productId, commentId, content, }: BaseCommentParamsType) => Promise<PersistedCommentEntity>;
  deleteComment: ({ userId, articleId, productId, commentId }: DeleteCommentParamsType) => Promise<void>;
}

type BaseCommentQueryType = BaseQueryType<CommentSort> & {
  articleId?: string;
  productId?: string;
};
type BaseCommentParamsType = {
  userId: string;
  articleId?: string;
  productId?: string;
  commentId: number;
  content: string;
}

type ValidateTargetParams = Pick<BaseCommentParamsType, "articleId" | "productId">;
type CreateCommentParamsType = Omit<BaseCommentParamsType, "commentId">;
type UpdateCommentParamsType = BaseCommentParamsType;
type DeleteCommentParamsType = Omit<BaseCommentParamsType, "content">;

export class CommentService extends BaseService implements ICommentService {
  constructor(repos: IRepos) {
    super(repos);
  }

  private _validateTargetExists = async ({ articleId, productId }: ValidateTargetParams) => {
    if (!articleId && !productId) {
      throw new Exception({ info: EXCEPTIONS.TARGETTYPE_NOT_EXIST });
    }

    if (productId) {
      const foundProduct = await this._repos.comment.findProductById(productId);
      if (!foundProduct) throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    if (articleId) {
      const foundArticle = await this._repos.comment.findArticleById(articleId);
      if (!foundArticle) throw new Exception({ info: EXCEPTIONS.ARTICLE_NOT_EXIST });
    }
  };

  getCommentList = async ({ articleId, productId, cursor, limit, sort }: BaseCommentQueryType) => {
    const orderBy: { field: CommentKeys; sort: Sort; } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        } : sort === "id-desc"
          ? {
            field: "id",
            sort: "desc"
          }
          : {
            field: "id",
            sort: "asc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    if (!articleId && !productId) {
      throw new Exception({ info: EXCEPTIONS.TARGETTYPE_NOT_EXIST });
    }

    const commentTotalCount = await this._repos.comment.count({
      articleId,
      productId,
    });

    if (commentTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: commentTotalCount });
    }
    const comments = await this._repos.comment.findCommentList({
      articleId,
      productId,
      cursor,
      limit,
      orderBy,
    })
    if (!comments) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    return comments;
  };

  createComment = async ({ userId, articleId, productId, content }: CreateCommentParamsType) => {
    await this._validateTargetExists({ articleId, productId });

    const entity = CommentEntity.factory({ userId, articleId, productId, content });

    const createdComment = await this._repos.comment.create(entity);

    if (!createdComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    return createdComment;
  };

  updateComment = async ({
    userId,
    articleId,
    productId,
    commentId,
    content,
  }: UpdateCommentParamsType) => {
    await this._validateTargetExists({ articleId, productId });

    const foundComment = await this._repos.comment.findCommentById({
      articleId,
      productId,
      commentId,
    });
    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    const comment = CommentEntity.factory({
      userId,
      articleId,
      productId,
      commentId,
      content,
    });

    const updatedComment = await this._repos.comment.update(comment);

    if (!updatedComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    return updatedComment;
  };

  deleteComment = async ({ userId, articleId, productId, commentId }: DeleteCommentParamsType) => {
    await this._validateTargetExists({ articleId, productId });

    const foundComment = await this._repos.comment.findCommentById({
      articleId,
      productId,
      commentId,
    });

    if (!foundComment) {
      throw new Exception({ info: EXCEPTIONS.COMMENT_NOT_EXIST });
    }
    if (userId !== foundComment.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_COMMENT_OWNER });
    }

    const deletedComment = await this._repos.comment.delete({
      articleId,
      productId,
      commentId,
    });
    return deletedComment;
  };
}
