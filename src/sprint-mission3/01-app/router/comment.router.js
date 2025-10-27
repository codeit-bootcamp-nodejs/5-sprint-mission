import { BaseRouter } from "./base.router.js";

export class CommentRouter extends BaseRouter {
  #commentController;
  constructor(commentController) {
    super("/api/comments", commentController);
    this.#commentController = commentController;
    this.registerCommentRouter();
  }

  registerCommentRouter = () => {
    this.router.post(
      "/:targetId",
      this.catchException(this.#commentController.createCommentController),
    );
    this.router.get(
      "/",
      this.catchException(this.#commentController.viewCommentListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#commentController.updateCommentController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#commentController.deleteCommentController),
    );
  };
}
