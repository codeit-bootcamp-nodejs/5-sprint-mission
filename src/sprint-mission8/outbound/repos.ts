import { PrismaClient } from "@prisma/client";
import { ArticleRepo } from "./article.repo";
import { CommentRepo } from "./comment.repo";
import { ProductRepo } from "./product.repo";
import { UserRepo } from "./user.repo";
import { IUserRepo } from "../domain/port/repo/i.user.repo";
import { IProductRepo } from "../domain/port/repo/i.product.repo";
import { IArticleRepo } from "../domain/port/repo/i.article.repo";
import { ICommentRepo } from "../domain/port/repo/i.comment.repo";

const prisma = new PrismaClient

export interface IRepos {
  user: IUserRepo;
  product: IProductRepo;
  article: IArticleRepo;
  comment: ICommentRepo;
}

export const repos: IRepos = {
  user: new UserRepo(prisma),
  product: new ProductRepo(prisma),
  article: new ArticleRepo(prisma),
  comment: new CommentRepo(prisma),
};