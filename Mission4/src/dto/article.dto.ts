export interface CreateArticleDto {
  title: string;
  content: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
}

export interface ArticleListQueryDto {
  offset: number;
  limit: number;
  keyword: string;
  sort: "recent" | "asc";
}
