import { Article } from "../../domain/entities/article.entity";

export class ArticlePresenter {
  toResponse(article: Article): {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      image: article.image,
      userId: article.userId,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
  toListResponse(
    articles: Article[],
    total: number,
  ): {
    list: Array<{
      id: number;
      title: string;
      content: string;
      image?: string | null;
      userId: number;
      createdAt: Date;
      updatedAt: Date;
    }>;
    totalCount: number;
  } {
    return {
      list: articles.map((article) => this.toResponse(article)),
      totalCount: total,
    };
  }

  toCreateResponse(article: Article): {
    id: number;
    title: string;
    content: string;
    image?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return this.toResponse(article);
  }

  toDeleteResponse(id: number): { id: number } {
    return { id };
  }
}
