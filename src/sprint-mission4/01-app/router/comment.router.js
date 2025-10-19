import { BaseRouter } from "./base.router.js";

export class CommentRouter extends BaseRouter {
  #controllers;
  constructor(controllers) {
    super("/api/comments");
    this.#controllers = controllers;
    this.registerCommentRouter();
  }

  registerCommentRouter = () => {
    this.router.post(
      "/:targetId",
      this.catchException(this.#controllers.comment.createCommentController),
    );
    this.router.get(
      "/",
      this.catchException(this.#controllers.comment.viewCommentListController),
    );
    this.router.patch(
      "/:id",
      this.catchException(this.#controllers.comment.updateCommentController),
    );
    this.router.delete(
      "/:id",
      this.catchException(this.#controllers.comment.deleteCommentController),
    );
  };
}
