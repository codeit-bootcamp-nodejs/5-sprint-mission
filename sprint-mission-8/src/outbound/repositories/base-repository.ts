import { PrismaClient } from "@prisma/client";
import { UserEntity } from "../../domain/entity/user-entity";
import { IBaseRepository } from "../../domain/port/repository/base-repository";

export class BaseRepository implements IBaseRepository {
  prisma;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  findUserByEmail = async (email: string) => {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserEntity.fromPersisted(user) : null;
  };

  findUserById = async (userId: number) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user ? UserEntity.fromPersisted(user) : null;
  };
}
