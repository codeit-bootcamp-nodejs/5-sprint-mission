import { User } from "../entities/user.entity";
import { ID } from "../../common/types/common";

export interface IUserRepository {
  create(data: {
    email: string;
    nickname: string;
    image?: string | null;
    hashedPassword: string;
  }): Promise<User>;
  findById(id: ID): Promise<User | null>;

  findByEmail(
    email: string,
  ): Promise<(User & { hashedPassword: string }) | null>;

  update(
    id: ID,
    data: {
      nickname?: string;
      image?: string | null;
    },
  ): Promise<User>;

  exists(id: ID): Promise<boolean>;

  existsByEmail(email: string): Promise<boolean>;

  existsByNickname(nickname: string): Promise<boolean>;

  saveRefreshToken(userId: ID, token: string, expiresAt: Date): Promise<void>;

  findRefreshToken(
    userId: ID,
    token: string,
  ): Promise<{ expiresAt: Date } | null>;

  deleteRefreshToken(userId: ID, token: string): Promise<void>;
}
