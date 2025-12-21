import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";

export type PersistedArticle = Article & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewArticle = Omit<Article, "id" | "createdAt" | "updatedAt">;

type Article = {
  readonly id?: string;
  title: string;
  content: string;
  readonly userId: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

export const Article = {
  createPersist: (params: {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }) => {
    return {
      id: params.id,
      title: params.title,
      content: params.content,
      userId: params.userId,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    } as PersistedArticle;
  },

  createNew: (params: { title: string; content: string; userId: string }) => {
    return {
      title: params.title,
      content: params.content,
      userId: params.userId,
    } as NewArticle;
  },

  validateTitle(title: string) {
    if (!title) {
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR
      })
    }
  },

  validateContent(content: string) {
    if (!content) {
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR
      })
    }
  },
};
