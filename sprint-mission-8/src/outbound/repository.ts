import { PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../domain/port/repository/article-repository";
import { IUserRepository } from "../domain/port/repository/user-repository";
import { IProductRepository } from "../domain/port/repository/product-repository";
import { ICommentRepository } from "../domain/port/repository/commnet-repository";
import { UserRepository } from "./repositories/user-repository";
import { ArticleRepository } from "./repositories/article-repository";
import { ProductRepository } from "./repositories/product-repository";
import { CommentRepository } from "./repositories/commet-repository";
import { BaseRepository } from "./repositories/base-repository";
import { IBaseRepository } from "../domain/port/repository/base-repository";
import { IAuthRepository } from "../domain/port/repository/auth-repository";
import { AuthRepository } from "./repositories/auth-repository";
import { NotificationRepository } from "./repositories/notification-repository";
import { INotificationRepository } from "../domain/port/repository/notification-repository";

export interface IRepository {
  base: IBaseRepository;
  auth: IAuthRepository;
  user: IUserRepository;
  article: IArticleRepository;
  product: IProductRepository;
  comment: ICommentRepository;
  notification: INotificationRepository;
}

export const createRepository = (prisma: PrismaClient): IRepository => ({
  base: new BaseRepository(prisma),
  auth: new AuthRepository(prisma),
  user: new UserRepository(prisma),
  article: new ArticleRepository(prisma),
  product: new ProductRepository(prisma),
  comment: new CommentRepository(prisma),
  notification: new NotificationRepository(prisma),
});

export interface PaginationQuery {
  offset?: number;
  limit?: number;
  search?: string;
}
