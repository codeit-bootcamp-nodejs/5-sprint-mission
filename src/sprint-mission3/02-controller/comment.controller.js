import { BaseContoller } from "./base.controller.js";

export class CommentController extends BaseContoller {
  #commentMiddleware;
  constructor(commentMiddleware) {
    super("/api/comment", commentMiddleware);
    this.#commentMiddleware = commentMiddleware;
    this.registerCommentRouter();
  }

  registerCommentRouter = () => {
    this.router.post(
      "/create",
      this.catchException(this.#commentMiddleware.createCommentMiddleware),
    );
    this.router.get(
      "/viewList",
      this.catchException(this.#commentMiddleware.viewCommentListMiddleware),
    );
    this.router.patch(
      "/update",
      this.catchException(this.#commentMiddleware.updateCommentMiddleware),
    );
    this.router.delete(
      "/delete",
      this.catchException(this.#commentMiddleware.deleteCommentMiddleware),
    );
  };
}
