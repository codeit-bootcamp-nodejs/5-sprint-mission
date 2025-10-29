import { Article } from "@prisma/client";

export type Sort = "asc" | "desc";

export type QueryType<TKey> = {
  offset?: number;
  cursor?: number;
  limit: number;
  orderBy: {
    field: TKey,
    sort: Sort;
  };
}
