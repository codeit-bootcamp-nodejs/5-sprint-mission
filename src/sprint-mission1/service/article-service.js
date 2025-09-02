import LoadArticleRes from "../dto/load-article-res.js";
import LoadArticleIdRes from "../dto/load-articleId-res.js";
import LoadArticlesRes from "../dto/load-articles-res.js";
import Article from "../entity/article.js";

export default class ArticleService {
  #articleRepository;

  constructor(articleRepository) {
    this.#articleRepository = articleRepository;
  }

  async loadArticles(params) {
    const articles = await this.#articleRepository.getArticleList(params);
    return new LoadArticlesRes(articles);
  }

  async loadArticle(id) {
    const article = await this.#articleRepository.getArticle(id);
    if (!article) {
      return null;
    }
    return new LoadArticleRes(
      article.id,
      article.title,
      article.content,
      article.createdAt,
      article.writer,
    );
  }

  async createArticle(surveyData, newWriter) {
    const newArticle = await this.#articleRepository.createArticle(
      surveyData,
      newWriter,
    );
    if (!newArticle) {
      return null;
    }
    return new LoadArticleRes(
      newArticle.id,
      newArticle.title,
      newArticle.content,
      newArticle.createdAt,
      newArticle.writer,
    );
  }

  async updateArticle(id, surveyData) {
    const updatedArticle = await this.#articleRepository.patchArticle(
      id,
      surveyData,
    );
    if (!updatedArticle) {
      return null;
    }
    return new LoadArticleRes(
      updatedArticle.id,
      updatedArticle.title,
      updatedArticle.content,
      updatedArticle.createdAt,
      updatedArticle.writer,
    );
  }

  async deleteArticle(id) {
    const deletearticle = await this.#articleRepository.deleteArticle(id);
    if (!deletearticle) {
      return null;
    }
    return new LoadArticleIdRes(deletearticle.id);
  }

  async likePush(article) {
    const entityArticle = new Article(
      article.id,
      article.title,
      article.content,
      article.createdAt,
      article.writer,
    );

    entityArticle.like();
    article.likeCount = entityArticle.likeCount;

    return article.likeCount;
  }
}
