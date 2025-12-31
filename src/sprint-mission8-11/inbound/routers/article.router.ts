import { ArticleCommentController } from "../controllers/article.comment.controller";
import { ArticleController } from "../controllers/article.controller";
import { ArticleLikeController } from "../controllers/article.like.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BaseRouter } from "./base.router";

export class ArticleRouter extends BaseRouter {
  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _articleController: ArticleController,
    private readonly _articleCommentController: ArticleCommentController,
    private readonly _articleLikeController: ArticleLikeController,
  ) {
    super("/api/articles");
    this.registerArticleRouter();
  }

  registerArticleRouter = () => {
    this.router.post(
      "/",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._articleController.createArticleController),
    );
    this.router.get(
      "/:articleId",
      this.catchException(this._articleController.getArticleController),
    );
    this.router.get(
      "/",
      this.catchException(this._articleController.getArticleListController),
    );
    this.router.patch(
      "/:articleId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._articleController.updateArticleController),
    );
    this.router.delete(
      "/:articleId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._articleController.deleteArticleController),
    );

    // 댓글 기능
    this.router.post(
      "/:articleId/comments",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._articleCommentController.createArticleCommentController,
      ),
    );
    this.router.get(
      "/:articleId/comments",
      this.catchException(
        this._articleCommentController.getArticleCommentListController,
      ),
    );
    this.router.patch(
      "/:articleId/comment/:commentId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._articleCommentController.updateArticleCommentController,
      ),
    );
    this.router.delete(
      "/:articleId/comment/:commentId",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._articleCommentController.deleteArticleCommentController,
      ),
    );

    // 좋아요 기능
    this.router.post(
      "/:articleId/like",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._articleLikeController.addArticleLikeController),
    );
    this.router.delete(
      "/:articleId/like",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(
        this._articleLikeController.cancelArticleLikeController,
      ),
    );
  };
}
