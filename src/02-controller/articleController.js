export class ArticleController {
  #articleService;
  constructor(articleService) { this.#articleService = articleService; }

  createArticle = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const article = await this.#articleService.createArticle(userId, req.body);
      res.status(201).json(article);
    } catch (err) { next(err); }
  };

  getArticles = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const articles = await this.#articleService.getArticles(userId);
      res.status(200).json(articles);
    } catch (err) { next(err); }
  };

  toggleLike = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { articleId } = req.params;
      const like = await this.#articleService.toggleLike(userId, articleId);
      res.status(200).json(like);
    } catch (err) { next(err); }
  };
}
