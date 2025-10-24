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

  createComment = async ({ articleId, productId, content }) => {
    await this.#validateTargetExists({ articleId, productId});

    const entity = Comment.factory({ articleId, productId, content });

    const createdComment = await this.#repos.comment.create(entity);

    return createdComment;
  };

  updateComment = async ({ articleId, productId, id, content }) => {
    await this.#validateTargetExists({ articleId, productId});

    const foundComment = await this.#repos.comment.findCommentById({ articleId, productId, id });
    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }


    const comment = Comment.factory({ articleId, productId, id, content });

    const updatedComment = await this.#repos.comment.update(comment);

    return updatedComment;
  };

  deleteComment = async ({ articleId, productId, id }) => {
    await this.#validateTargetExists({ articleId, productId});

    const foundComment = await this.#repos.comment.findCommentById({ articleId, productId, id });

    if (!foundComment) {
      throw new Exception("COMMENT_NOT_EXIST");
    }
    const deletedComment = await this.#repos.comment.delete({ articleId, productId, id });
    return deletedComment;
  };
}
