import { User } from "@prisma/client";
import { PersistedUserEntity, UserEntity } from "../../03-domain/entity/user.entity";

export class UserMapper {
  static toEntity(entity: User) : PersistedUserEntity {
    return new UserEntity({
      id: entity.id,
      email: entity.email,
      nickname: entity.nickname,
      image: entity.image ?? undefined,
      password: entity.password,
      refreshToken: entity.refreshToken ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }) as PersistedUserEntity;
  }
  static toPersistent(entity: UserEntity) {
    return {
      email: entity.email,
      nickname: entity.nickname,
      image: entity.image,
      password: entity.password,
      refreshToken: entity.refreshToken,
    };
  }
}
