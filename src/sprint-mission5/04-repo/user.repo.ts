import { PrismaClient } from "@prisma/client";
import { UserMapper } from "./mapper/user.mapper";
import { ProductMapper } from "./mapper/product.mapper";
import { ArticleMapper } from "./mapper/article.mapper";
import { QueryType } from "../types/query";
import { UserEntity } from "../03-domain/entity/user.entity";
import { BaseRepo } from "./base.repo";
import { IUserRepo } from "../03-domain/port/repo/i.user.repo";

export type UserKeys = "updatedAt" | "email";

export type UserListQueryType<TKey> = QueryType<TKey> & {
  id: string;
};

export class UserRepo extends BaseRepo implements IUserRepo {

  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  findUserByEmail = async (email: string) => {
    const user = await this._prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toEntity(user) : null;
  };

  findUserById = async (id: string) => {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toEntity(user) : null;
  };

  findUserLikeProducts = async (id: string, offset: number, limit: number) => {
    const userLikeProducts = await this._prisma.productLike.findMany({
      where: {
        userId: id,
        isLiked: true,
      },
      skip: offset,
      take: limit,
      include: {
        product: true,
      },
    });
    if (!userLikeProducts || userLikeProducts.length === 0) return null;

    return userLikeProducts.map((userLikeProduct) => {
      const articleWithLike = {
        ...userLikeProduct.product,
        ArticleLike: [userLikeProduct],
      };

      return ProductMapper.toEntity(articleWithLike);
    });
  };

  findUserLikeArticles = async (id: string, offset: number, limit: number) => {
    const userLikeArticles = await this._prisma.articleLike.findMany({
      where: {
        userId: id,
        isLiked: true,
      },
      skip: offset,
      take: limit,
      include: {
        article: true,
      },
    });

    if (!userLikeArticles || userLikeArticles.length === 0) return null;

    return userLikeArticles.map((userLikeArticle) => {
      const articleWithLike = {
        ...userLikeArticle.article,
        ArticleLike: [userLikeArticle],
      };

      return ArticleMapper.toEntity(articleWithLike);
    });
  };

  findUserByRefreshToken = async (refreshToken: string) => {
    const user = await this._prisma.user.findUnique({
      where: { refreshToken },
    });
    return user ? UserMapper.toEntity(user) : null;
  };
  
  findUserProducts = async <TKey extends UserKeys>({ id, offset, limit, orderBy }: UserListQueryType<TKey>) => {
    const userProducts = await this._prisma.product.findMany({
      where: { userId: id },
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort
      },
    });
    return userProducts && userProducts.length > 0
      ? userProducts.map((userProduct) =>
        ProductMapper.toEntity(userProduct),
      )
      : null;
  };

  create = async (entity: UserEntity) => {
    const newUser = await this._prisma.user.create({
      data: {
        ...UserMapper.toPersistent(entity),
      },
    });
    return UserMapper.toEntity(newUser);
  };

  update = async (entity: UserEntity) => {
    const updateUser = await this._prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        ...UserMapper.toPersistent(entity),
      },
    });
    return UserMapper.toEntity(updateUser);
  };

  updatePassword = async (entity: UserEntity) => {
    const updateUser = await this._prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        ...UserMapper.toPersistent(entity),
      },
    });
    return UserMapper.toEntity(updateUser);
  };

  delete = async (id: string) => {
    const deleteUser = await this._prisma.user.delete({
      where: {
        id,
      },
    });
  };

  generate = async (userId: string, refreshToken: string) => {
    const user = await this._prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  };

  refreshTokenDelete = async (id: string, refreshToken: string) => {
    const user = await this._prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  };
}
