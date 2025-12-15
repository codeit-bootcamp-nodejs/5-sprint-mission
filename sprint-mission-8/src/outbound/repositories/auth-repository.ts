import { PrismaClient } from "@prisma/client";
import { IAuthRepository } from "../../domain/port/repository/auth-repository";
import { BaseRepository } from "./base-repository";
import { UserEntity } from "../../domain/entity/user-entity";
import { NewUserAttrs } from "../../domain/entity/user-entity";

export class AuthRepository extends BaseRepository implements IAuthRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  registUser = async (userData: NewUserAttrs) => {
    const newUser = await this.prisma.user.create({
      data: {
        email: userData.email,
        nickname: userData.nickname,
        password: userData.hasedPassword,
        images: userData.image ? [userData.image] : [],
      },
    });

    return UserEntity.fromPersisted(newUser);
  };

  updateRefreshToken = async (
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ) => {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: {
          deleteMany: { userId: userId },
          create: [
            {
              token: refreshToken,
              expiresAt: expiresAt,
            },
          ],
        },
      },
    });
  };

  validateRefreshToken = async (userId: number, refreshToken: string) => {
    return await this.prisma.user.findFirst({
      where: {
        id: userId,
        refreshToken: {
          some: {
            token: refreshToken,
            expiresAt: { gt: new Date() },
          },
        },
      },
    });
  };
}
