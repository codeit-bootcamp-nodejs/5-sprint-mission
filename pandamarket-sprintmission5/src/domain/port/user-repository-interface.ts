import { PersistedUserEntity, UserEntity } from "../entity/user-entity";
import { updateUserDto } from "../../dto/user/update-user.dto";

export interface IUserRepository {
  update(
    userId: number,
    updateData: updateUserDto,
  ): Promise<PersistedUserEntity>;
  updatePassword(
    userId: number,
    newHashedPassword: string,
  ): Promise<PersistedUserEntity>;
}
