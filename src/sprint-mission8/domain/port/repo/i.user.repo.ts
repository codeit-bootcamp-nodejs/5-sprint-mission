import { UserListQueryType } from "../../../outbound/user.repo";
import { UserKeys } from "../../../types/query";
import { ArticleEntity } from "../../entity/article.entity";
import { ProductEntity } from "../../entity/product/product.entity";
import { PersistedUserEntity, UserEntity } from "../../entity/user.entity";

export interface IUserRepo {
  findUserByEmail: (email: string) => Promise<PersistedUserEntity | null>;
  findUserById: (id: string) => Promise<PersistedUserEntity | null>;
  findUserLikeProducts: (id: string, offset: number, limit: number) => Promise<ProductEntity[] | null>;
  findUserLikeArticles: (id: string, offset: number, limit: number) => Promise<ArticleEntity[] | null>;
  findUserByRefreshToken: (refreshToken: string) => Promise<UserEntity | null>;
  findUserProducts: ({ id, offset, limit, orderBy }: UserListQueryType) => Promise<ProductEntity[] | null>;
  create: (entity: UserEntity) => Promise<PersistedUserEntity>;
  update: (entity: UserEntity) => Promise<PersistedUserEntity>;
  updatePassword: (entity: UserEntity) => Promise<PersistedUserEntity>;
  delete: (id: string) => Promise<void>;
  generate: (userId: string, refreshToken: string) => Promise<PersistedUserEntity | null>;
  DeleteRefreshToken: (id: string, refreshToken: null) => Promise<void>;
}