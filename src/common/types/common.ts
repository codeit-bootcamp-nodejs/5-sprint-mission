import { Request, Response, NextFunction } from "express";

export type ID = number;
export type StringOrNumber = string | number;

export type PromiseResult<T> = Promise<T>;
export type AsyncResult<T> = Promise<T>;

export type ExpressHandler = (req: Request, res: Response) => Promise<void>;
export type AuthenticatedHandler = (
  req: Request,
  res: Response,
) => Promise<void>;
export type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;
export type AuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

export type ApiSuccessResponse<T> = { data: T; message?: string };
export type ApiErrorResponse = { message: string; error?: string };
export type ApiListResponse<T> = PaginatedResponse<T> | CursorResponse<T>;

export type CreateOperation<T> = Omit<T, "id" | keyof TimestampFields>;
export type UpdateOperation<T> = Partial<Omit<T, "id" | keyof TimestampFields>>;
export type SelectFields<T> = Partial<Record<keyof T, boolean>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonNullable<T> = T extends null | undefined ? never : T;
export type Nullable<T> = T | null;

export interface User {
  userId: ID;
  email?: string;
  nickname?: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  list: T[];
  totalCount: number;
}

export interface CursorResponse<T> {
  list: T[];
  nextCursor: ID | null;
}

export interface LikeableItem {
  id: ID;
  [key: string]: unknown;
}

export interface LikeableItemWithLiked extends LikeableItem {
  isLiked: boolean;
}

export interface TimestampFields {
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithoutTimestamps<T> = Omit<T, keyof TimestampFields>;
