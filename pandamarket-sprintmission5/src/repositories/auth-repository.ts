import { PrismaClient } from "@prisma/client";
import { IAuthRepository } from "../domain/port/auth-repository-interface";
import { BaseRepository } from "./base-repository";
import { UserMapper } from "./mapper/user-mapper";
import { SignUpDto } from "../dto/user/signup-user.dto";

export class AuthRepository extends BaseRepository implements IAuthRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  registUser = async (userData: SignUpDto) => {
    const newUser = await this.prisma.user.create({
      data: userData,
    });

    return UserMapper.toEntity(newUser);
  };

  updateRefreshToken = async (
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ) => {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokens: {
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
        refreshTokens: {
          some: {
            token: refreshToken,
            expiresAt: { gt: new Date() },
          },
        },
      },
    });
  };
}
