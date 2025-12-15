import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base-repository";
import { IUserRepository } from "../../domain/port/repository/user-repository";
import { UpdateUserAttrs, UserEntity } from "../../domain/entity/user-entity";
import NotFoundError from "../../shared/errors/NotFoundError";

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  findById = async (userId: number) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { refreshToken: true },
    });

    if (!user) {
      throw new NotFoundError("내 정보를 불러올 수 없습니다.", userId);
    }

    return UserEntity.fromPersisted(user);
  };

  update = async (userId: number, updateData: UpdateUserAttrs) => {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return UserEntity.fromPersisted(updatedUser);
  };

  updatePassword = async (userId: number, newHashedPassword: string) => {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
    return UserEntity.fromPersisted(updatedUser);
  };
}
