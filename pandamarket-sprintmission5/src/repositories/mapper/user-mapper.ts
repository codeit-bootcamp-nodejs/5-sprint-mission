import { User } from "@prisma/client";
import { PersistentedUser, UserEntity } from "../../domain/entity/user-entity";

export class UserMapper {
  static toPersistent(entity: UserEntity) {
    return {
      email: entity.email,
      password: entity.hasedPassword,
      nickname: entity.nickname,
    };
  }

  static toEntity(user: User) {
    return new UserEntity({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      hasedPassword: user.password,
      image: user.image ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }) as PersistentedUser;
  }
}
