import { User } from "@prisma/client";
import { NewUserAttrs, PersistedUserEntity } from "../../entity/user-entity";

export interface IAuthRepository {
  registUser(userdata: NewUserAttrs): Promise<PersistedUserEntity>;
  updateRefreshToken(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void>;
  validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User | null>;
}
