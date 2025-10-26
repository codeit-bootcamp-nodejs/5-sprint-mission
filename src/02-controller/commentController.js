export class CommentController {
  #commentService;
  constructor(commentService) {
    this.#commentService = commentService;
  }

  createProductComment = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { productId, content } = req.body;
      const comment = await this.#commentService.createProductComment(userId, productId, content);
      res.status(201).json(comment);
    } catch (err) { next(err); }
  };

  createArticleComment = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { articleId, content } = req.body;
      const comment = await this.#commentService.createArticleComment(userId, articleId, content);
      res.status(201).json(comment);
    } catch (err) { next(err); }
  };

  updateComment = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { commentId, content } = req.body;
      const updated = await this.#commentService.updateComment(userId, commentId, content);
      res.status(200).json(updated);
    } catch (err) { next(err); }
  };

  deleteComment = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;
      await this.#commentService.deleteComment(userId, commentId);
      res.status(204).send();
    } catch (err) { next(err); }
  };
}
