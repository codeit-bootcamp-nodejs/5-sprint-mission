import { Article } from "../entities/article.entity";
import { ID } from "../../common/types/common";

export interface IArticleRepository {
  create(data: {
    title: string;
    content: string;
    image?: string | null;
    userId: ID;
  }): Promise<Article>;

  findById(id: ID): Promise<Article | null>;

  findMany(query: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
  }): Promise<{ items: Article[]; total: number }>;

  update(
    id: ID,
    data: {
      title?: string;
      content?: string;
      image?: string | null;
    },
  ): Promise<Article>;

  delete(id: ID): Promise<void>;

  countByUserId(userId: ID): Promise<number>;
  exists(id: ID): Promise<boolean>;
}
