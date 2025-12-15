import { UserEntity } from "../../domain/entity/user-entity";

export const mapUser = (user: UserEntity) => ({
  id: user.id,
  email: user.email,
  nickname: user.nickname,
  image: user.image,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
