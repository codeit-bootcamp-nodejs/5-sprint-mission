import { Article } from "@prisma/client";

export type Sort = "asc" | "desc";
export type ArticleKeys = "updatedAt" | "title"
export type ProductKeys = "updatedAt" | "price";
export type CommentKeys = "updatedAt" | "id";
export type UserKeys = "updatedAt" | "email";

export type QueryType<TKey extends string> = {
  offset?: number;
  cursor?: number;
  limit: number;
  orderBy: {
    field: TKey,
    sort: Sort;
  };
}

export type ArticleSort = "recent" | "title-asc" | "title-desc";
export type ProductSort = "recent" | "price-lowest" | "price-highest";
export type CommentSort = "recent" | "id-asc" | "id-desc";
export type UserSort = "recent" | "email-asc" | "email-desc";

export type BaseQueryType<TSort extends string> = {
  offset?: number;
  cursor?: number;
  limit: number;
  sort?: TSort;
}
