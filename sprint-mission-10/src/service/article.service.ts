import { ArticleRepository } from "../repo/article.repository";
import { CreateArticleDto, UpdateArticleDto, ArticleListQueryDto } from "../dto/article.dto";
import { HttpError } from "../middlewares/error.handler";

export class ArticleService {
  private articleRepository;
  
  constructor(articleRepository: ArticleRepository) {
    this.articleRepository = articleRepository;
  }

  async createArticle(authorId: number, data: CreateArticleDto) {
    return this.articleRepository.createArticle(authorId, data);
  }

  async getArticles(query: ArticleListQueryDto, userId?: number) {
    const articles = await this.articleRepository.findArticles(query, userId);

    return articles.map((article) => {
      const { _count, likes, author, ...rest } = article;
      return {
        ...rest,
        authorNickname: author.nickname,
        likeCount: _count.likes,
        isLiked: !!(likes && likes.length > 0),
      };
    });
  }

  async getArticleById(id: number, userId?: number) {
    const article = await this.articleRepository.findArticleById(id, userId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    const { _count, likes, author, ...rest } = article;
    return {
      ...rest,
      authorNickname: author.nickname,
      likeCount: _count.likes,
      isLiked: !!(likes && likes.length > 0),
    };
  }

  async updateArticle(articleId: number, userId: number, data: UpdateArticleDto) {
    const article = await this.articleRepository.findArticleByIdSimple(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }
    if (article.authorId !== userId) {
      throw new HttpError(403, "게시글을 수정할 권한이 없습니다.");
    }

    return this.articleRepository.updateArticle(articleId, data);
  }

  async deleteArticle(articleId: number, userId: number) {
    const article = await this.articleRepository.findArticleByIdSimple(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }
    if (article.authorId !== userId) {
      throw new HttpError(403, "게시글을 삭제할 권한이 없습니다.");
    }

    await this.articleRepository.deleteArticle(articleId);
  }

  async toggleArticleLike(articleId: number, userId: number) {
    const article = await this.articleRepository.findArticleByIdSimple(articleId);
    if (!article) {
      throw new HttpError(404, "게시글을 찾을 수 없습니다.");
    }

    const existingLike = await this.articleRepository.findArticleLike(
      userId,
      articleId,
    );

    let isLiked: boolean;
    if (existingLike) {
      await this.articleRepository.deleteArticleLike(existingLike.id);
      isLiked = false;
    } else {
      await this.articleRepository.createArticleLike(userId, articleId);
      isLiked = true;
    }

    const likeCount = await this.articleRepository.countArticleLikes(articleId);

    return {
      articleId,
      userId,
      isLiked,
      likeCount,
    };
  }
}
