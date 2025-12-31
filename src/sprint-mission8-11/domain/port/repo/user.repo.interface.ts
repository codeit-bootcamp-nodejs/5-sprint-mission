import { Sort, UserKeys } from "../../../types/query";
import { ArticleEntity } from "../../entity/article.entity";
import {
  PersistProductEntity,
  ProductEntity,
} from "../../entity/product/product.entity";
import {
  NewUserEntity,
  PersistUserEntity,
  UserEntity,
} from "../../entity/user.entity";

export interface IUserRepo {
  findUserByEmail(email: string): Promise<PersistUserEntity | null>;
  findUserById(id: string): Promise<PersistUserEntity | null>;
  findUserProducts(
    id: string,
    offset: number,
    limit: number,
    orderBy: { field: UserKeys; sort: Sort },
  ): Promise<PersistProductEntity[] | null>;
  create(entity: NewUserEntity): Promise<PersistUserEntity>;
  update(entity: PersistUserEntity): Promise<PersistUserEntity>;
  delete(id: string): Promise<void>;
}
