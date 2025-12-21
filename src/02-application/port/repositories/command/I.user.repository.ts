import { NewUserEntity, PersistedUserEntity } from "../../../command/entity/user.entity";



export interface IUserCommandRepository {
  save(entity: NewUserEntity): Promise<PersistedUserEntity>;


  findById(id: string): Promise<PersistedUserEntity>;

  findByEmail(email: string): Promise<PersistedUserEntity>;

  update(
    foundEntity: PersistedUserEntity,
    newEntity: NewUserEntity,
  ): Promise<PersistedUserEntity>;
}
