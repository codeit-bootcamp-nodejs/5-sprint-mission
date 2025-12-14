import { IUtils } from "../../shared/util";
import { Controllers } from "../controllers";
import { BaseRouter } from "./base.router";

export class ArticleRouter extends BaseRouter {
  constructor(controllers: Controllers, utils: IUtils) {
    super("/api/articles", controllers, utils);
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/",
      this.isAuthenticate,
      this.catchException(this.controllers.article.createArticleController),
    );
    this.router.get(
      "/:articleId",
      this.catchException(this.controllers.article.getArticleController),
    );
    this.router.get(
      "/",
      this.catchException(this.controllers.article.getArticleListController),
    );
    this.router.patch(
      "/:articleId",
      this.isAuthenticate,
      this.catchException(this.controllers.article.updateArticleController),
    );
    this.router.delete(
      "/:articleId",
      this.isAuthenticate,
      this.catchException(this.controllers.article.deleteArticleController),
    );

    // 댓글 기능
    this.router.post(
      "/:articleId/comments",
      this.isAuthenticate,
      this.catchException(
        this.controllers.articleComment.createArticleCommentController,
      ),
    );
    this.router.get(
      "/:articleId/comments",
      this.catchException(
        this.controllers.articleComment.getArticleCommentListController,
      ),
    );
    this.router.patch(
      "/:articleId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(
        this.controllers.articleComment.updateArticleCommentController,
      ),
    );
    this.router.delete(
      "/:articleId/comment/:commentId",
      this.isAuthenticate,
      this.catchException(
        this.controllers.articleComment.deleteArticleCommentController,
      ),
    );

    // 좋아요 기능
    this.router.post(
      "/:articleId/like",
      this.isAuthenticate,
      this.catchException(
        this.controllers.articleLike.addArticleLikeController,
      ),
    );
    this.router.delete(
      "/:articleId/like",
      this.isAuthenticate,
      this.catchException(
        this.controllers.articleLike.cancelArticleLikeController,
      ),
    );
  };
}
