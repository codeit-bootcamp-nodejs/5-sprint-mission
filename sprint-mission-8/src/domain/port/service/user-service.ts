import { PersistedUserEntity, UpdateUserAttrs } from "../../entity/user-entity";

export interface IUserService {
  getMyInfo: (userId: number) => Promise<PersistedUserEntity>;
  updateMyInfo: (
    userId: number,
    updateData: UpdateUserAttrs,
  ) => Promise<PersistedUserEntity>;
  changeMyPassword: (
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) => Promise<PersistedUserEntity>;
}
