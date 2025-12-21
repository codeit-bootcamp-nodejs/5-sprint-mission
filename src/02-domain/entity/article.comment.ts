export type NewArticleComment = Omit<
  ArticleComment,
  "id" | "createdAt" | "updatedAt"
>;

export type PersistedArticleComment = ArticleComment & {
  id: string;
};

type ArticleComment = {
  readonly id?: string;
  readonly articleId?: string;
  content: string;
  userId: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

export const ArticleComment = {
  createNew: (params: {
    articleId: string;
    content: string;
    userId: string;
  }) => {
    return {
      articleId: params.articleId,
      content: params.content,
      userId: params.userId,
    } as NewArticleComment;
  },

  createPersisted: (params: {
    id: string;
    articleId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }) => {
    return {
      id: params.id,
      articleId: params.articleId,
      content: params.content,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      userId: params.userId,
    } as PersistedArticleComment;
  },
};
