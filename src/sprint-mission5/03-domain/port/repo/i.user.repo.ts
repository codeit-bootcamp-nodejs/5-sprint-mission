import { UserKeys, UserListQueryType } from "../../../04-repo/user.repo";
import { ArticleEntity } from "../../entity/article.entity";
import { ProductEntity } from "../../entity/product.entity";
import { UserEntity } from "../../entity/user.entity";

export interface IUserRepo {
  findUserByEmail: (email: string) => Promise<UserEntity | null>;
  findUserById: (id: string) => Promise<UserEntity | null>;
  findUserLikeProducts: (id: string, offset: number, limit: number) => Promise<ProductEntity[] | null>;
  findUserLikeArticles: (id: string, offset: number, limit: number) => Promise<ArticleEntity[] | null>;
  findUserByRefreshToken: (refreshToken: string) => Promise<UserEntity | null>;
  findUserProducts: <TKey extends UserKeys>({ id, offset, limit, orderBy }: UserListQueryType<TKey>) => Promise<ProductEntity[] | null>;
  create: (entity: UserEntity) => Promise<UserEntity>;
  update: (entity: UserEntity) => Promise<UserEntity>;
  updatePassword: (entity: UserEntity) => Promise<UserEntity>;
  delete: (id: string) => Promise<void>;
  generate: (userId: string, refreshToken: string) => Promise<UserEntity | null>;
  refreshTokenDelete: (id: string, refreshToken: string) => Promise<void>;
}