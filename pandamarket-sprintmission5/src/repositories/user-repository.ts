import { Prisma, PrismaClient } from "@prisma/client";
import { IUserRepository } from "../domain/port/user-repository-interface";
import { BaseRepository } from "./base-repository";
import { UserMapper } from "./mapper/user-mapper";
import { updateUserDto } from "../dto/user/update-user.dto";

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  update = async (userId: number, updateData: updateUserDto) => {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    return updatedUser ? UserMapper.toEntity(updatedUser) : null;
  };

  updatePassword = async (userId: number, newHashedPassword: string) => {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { password: newHashedPassword },
    });
    return updatedUser ? UserMapper.toEntity(updatedUser) : null;
  };
}
