import { User } from "../../03-domain/entity/user.js";

export class UserMapper {
  static toEntity(record) {
    return new User({
      id: record.id,
      email: record.email,
      nickname: record.nickname,
      image: record.image,
      password: record.password,
      refreshToken: record.refreshToken,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
  static toPersistent(entity) {
    return {
      email: entity.email,
      nickname: entity.nickname,
      image: entity.image,
      password: entity.password,
      refreshToken: entity.refreshToken,
    };
  }
}