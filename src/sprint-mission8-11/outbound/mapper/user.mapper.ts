import { User } from "@prisma/client";
import { NewUserEntity, PersistUserEntity, UserEntity } from "../../application/command/entity/user.entity";

export type CreateUserData = {
  email: string;
  nickname: string;
  image: string | undefined;
  password: string;
};

export type UpdateUserData = {
  nickname: string;
  image: string | undefined;
  password: string;
  refreshToken?: string;
};

export class UserMapper {
  static toCreateData(entity: NewUserEntity): CreateUserData {
    return {
      email: entity.email,
      nickname: entity.nickname,
      image: entity.image ?? undefined,
      password: entity.password,
    };
  }

  static toUpdateData(entity: PersistUserEntity): UpdateUserData {
    return {
      nickname: entity.nickname,
      image: entity.image ?? undefined,
      password: entity.password,
      refreshToken: entity.refreshToken,
    };
  }

  static toPersistEntity(entity: User) {
    return UserEntity.createPersist({
      id: entity.id,
      email: entity.email,
      nickname: entity.nickname,
      image: entity.image ?? undefined,
      password: entity.password,
      refreshToken: entity.refreshToken ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
