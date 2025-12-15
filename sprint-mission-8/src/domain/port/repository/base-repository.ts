import { PersistedUserEntity } from "../../entity/user-entity";

export interface IBaseRepository {
  findUserByEmail(email: string): Promise<PersistedUserEntity | null>;
  findUserById(userId: number): Promise<PersistedUserEntity | null>;
}
