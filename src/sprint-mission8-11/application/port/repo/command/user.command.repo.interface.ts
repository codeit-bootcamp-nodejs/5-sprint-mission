import { Sort, UserKeys } from "../../../../types/query";
import { PersistProductEntity } from "../../../command/entity/product/product.entity";
import { PersistUserEntity, NewUserEntity } from "../../../command/entity/user.entity";

export interface IUserCommandRepo {
  findUserByEmail(email: string): Promise<PersistUserEntity | null>;
  findUserById(id: string): Promise<PersistUserEntity | null>;
  create(entity: NewUserEntity): Promise<PersistUserEntity>;
  update(entity: PersistUserEntity): Promise<PersistUserEntity>;
  delete(id: string): Promise<void>;
}
