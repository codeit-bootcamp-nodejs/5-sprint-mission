import { PrismaClient } from "@prisma/client";
import { UserMapper } from "./mapper/user-mapper";
import { IBaseRepository } from "../domain/port/base-repository-interface";

export class BaseRepository implements IBaseRepository {
  prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findUserByEmail = async (email: string) => {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toEntity(user) : null;
  };

  findUserById = async (userId: number) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user ? UserMapper.toEntity(user) : null;
  };
}
