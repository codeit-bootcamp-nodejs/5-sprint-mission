import { NewUserEntity, PersistedUserEntity } from "../../entity/user.entity";

export interface IUserRepository {
  save(entity: NewUserEntity): Promise<PersistedUserEntity>;

  findById(id: string): Promise<PersistedUserEntity>;

  findByEmail(email: string): Promise<PersistedUserEntity>;

  update(
    foundEntity: PersistedUserEntity,
    newEntity: NewUserEntity,
  ): Promise<PersistedUserEntity>;
}
