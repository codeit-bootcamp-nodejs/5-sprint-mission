import { User } from "@prisma/client";
import { SignUpDto } from "../../dto/user/signup-user.dto";
import { PersistedUserEntity } from "../entity/user-entity";

export interface IAuthRepository {
  registUser(userdata: SignUpDto): Promise<PersistedUserEntity>;
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
