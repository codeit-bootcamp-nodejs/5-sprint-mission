export interface ArticleCreateDto {
  title: string;
  content: string;
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
}
