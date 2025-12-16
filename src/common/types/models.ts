import {
  ID,
  StringOrNumber,
  TimestampFields,
  PaginatedResponse,
} from "./common";

export interface ArticleBase {
  title: string;
  content: string;
  image?: string | null;
}

export interface Article extends ArticleBase, TimestampFields {
  id: ID;
  userId: ID;
}

export interface ArticleCreateData extends ArticleBase {}
export interface ArticleUpdateData extends Partial<ArticleBase> {}

export interface ArticleListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  orderBy?: string;
}

export type ArticleListResponse = PaginatedResponse<Article>;

export interface ProductBase {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface Product extends ProductBase, TimestampFields {
  id: ID;
  userId: ID;
}

export interface ProductCreateData extends ProductBase {}
export interface ProductUpdateData extends Partial<ProductBase> {}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  orderBy?: string;
}

export type ProductListResponse = PaginatedResponse<Product>;

export interface CommentBase {
  content: string;
}

export interface Comment extends CommentBase, TimestampFields {
  id: ID;
  userId: ID;
  articleId?: ID | null;
  productId?: ID | null;
}

export interface CommentCreateData extends CommentBase {}
export interface CommentUpdateData extends Partial<CommentBase> {}

export interface Like extends TimestampFields {
  id: ID;
  userId: ID;
  articleId?: ID | null;
  productId?: ID | null;
}

export type LikeTarget = "article" | "product";
export type LikeAction = "like" | "unlike";
