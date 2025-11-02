import prisma from "../prisma.client";
import { User } from "@prisma/client";
import { SignUpDto } from "../dto/auth.dto";
import { UpdateMeDto } from "../dto/user.dto";

export class UserRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserByNickname(nickname: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { nickname } });
  }

  async findUserById(userId: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  async createUser(data: SignUpDto, hashedPassword_ts: string): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        password: hashedPassword_ts,
      },
    });
  }

  async updateUserRefreshToken(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateMe(userId: number, data: UpdateMeDto): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateUserPassword(userId: number, password_ts: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: password_ts },
    });
  }

  async findUserProducts(userId: number) {
    return prisma.product.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
  }

  async findUserLikedProducts(userId: number) {
    return prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
  }
}

