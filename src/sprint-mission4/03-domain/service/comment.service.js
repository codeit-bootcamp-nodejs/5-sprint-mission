import { Exception, EXCEPTIONS } from "../../common/const/exception.js";
import { Comment } from "../entity/comment.js";

export class CommentService {
  #repos;
  constructor(repos) {
    this.#repos = repos;
  }

  #validateTargetExists = async ({ articleId, productId }) => {
    if (productId) {
      const foundProduct = await this.#repos.comment.findProductById(productId);
      if (!foundProduct) throw new Exception("PRODUCT_NOT_EXIST");
    }

    if (articleId) {
      const foundArticle = await this.#repos.comment.findArticleById(articleId);
      if (!foundArticle) throw new Exception("ARTICLE_NOT_EXIST");
    }

    if(!articleId && !productId){
      throw new Exception("TARGETTYPE_NOT_EXSIST");
    }
  };

  getCommentList = async ({ articleId, productId, cursor, limit, sort }) => {
    const orderBy =
      sort === "recent" ? { updatedAt: "desc" } : { content: "asc" };

    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }
    
    if (!articleId && !productId) {
      throw new Exception("TARGETTYPE_NOT_EXSIST");
    }

    const commentTotalCount = await this.#repos.comment.count({
      articleId,
      productId,
    });

    if (commentTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: commentTotalCount });
    }

    return await this.#repos.comment.findCommentList({
      articleId,
      productId,
      cursor,
      limit,
      orderBy,
    });

  };

  createComment = async ({ userId, articleId, productId, content }) => {
    await this.#validateTargetExists({ articleId, productId});

    const entity = Comment.factory({ userId, articleId, productId, content });

    const createdComment = await this.#repos.comment.create(entity);

    return createdComment;
  };

  updateComment = async ({ userId, articleId, productId, commentId, content }) => {
    await this.#validateTargetExists({ articleId, productId});

    const foundComment = await this.#repos.comment.findCommentById({ articleId, productId, commentId });
    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }
    if(userId !== foundComment.userId){
      throw new Exception("UNAUTHORIZED_COMMENT_OWNER")
    }

    const comment = Comment.factory({ articleId, productId, commentId, content });

    const updatedComment = await this.#repos.comment.update(comment);

    return updatedComment;
  };

  deleteComment = async ({ userId, articleId, productId, commentId }) => {
    await this.#validateTargetExists({ articleId, productId});

    const foundComment = await this.#repos.comment.findCommentById({ articleId, productId, commentId });

    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }
    if(userId !== foundComment.userId){
      throw new Exception("UNAUTHORIZED_COMMENT_OWNER")
    }

    const deletedComment = await this.#repos.comment.delete({ articleId, productId, commentId });
    return deletedComment;
  };
}
