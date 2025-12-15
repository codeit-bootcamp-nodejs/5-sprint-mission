import { PersistedUserEntity, UpdateUserAttrs } from "../../entity/user-entity";

export interface IUserRepository {
  findById(userId: number): Promise<PersistedUserEntity>;
  update(
    userId: number,
    updateData: UpdateUserAttrs,
  ): Promise<PersistedUserEntity>;
  updatePassword(
    userId: number,
    newHashedPassword: string,
  ): Promise<PersistedUserEntity>;
}
