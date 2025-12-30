export interface UserArticleView {
  nickname: string;
  articles: {
    title: string;
    createdAt: Date;
  }[];
}
