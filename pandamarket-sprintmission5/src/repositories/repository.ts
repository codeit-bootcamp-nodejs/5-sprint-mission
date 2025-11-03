import { PrismaClient } from "@prisma/client";
import { IArticleRepository } from "../domain/port/article-repository-interface";
import { IUserRepository } from "../domain/port/user-repository-interface";
import { IProductRepository } from "../domain/port/product-repository-interface";
import { ICommentRepository } from "../domain/port/commnet-repository-interface";
import { UserRepository } from "./user-repository";
import { ArticleRepository } from "./article-repository";
import { ProductRepository } from "./product-repository";
import { CommentRepository } from "./commet-repository";
import { BaseRepository } from "./base-repository";
import { IBaseRepository } from "../domain/port/base-repository-interface";
import { IAuthRepository } from "../domain/port/auth-repository-interface";
import { AuthRepository } from "./auth-repository";

const prisma = new PrismaClient();

export interface IRepository {
  base: IBaseRepository;
  auth: IAuthRepository;
  user: IUserRepository;
  article: IArticleRepository;
  product: IProductRepository;
  comment: ICommentRepository;
}

export const repository: IRepository = {
  base: new BaseRepository(prisma),
  auth: new AuthRepository(prisma),
  user: new UserRepository(prisma),
  article: new ArticleRepository(prisma),
  product: new ProductRepository(prisma),
  comment: new CommentRepository(prisma),
};

export interface PaginationQuery {
  offset?: number;
  limit?: number;
  search?: string;
}
