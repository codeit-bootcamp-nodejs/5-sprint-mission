import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../domain/ports/I.user.repository";
import { User } from "../../domain/entities/user.entity";
import { ID } from "../../common/types/common";

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    email: string;
    nickname: string;
    image?: string | null;
    hashedPassword: string;
  }): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        image: data.image,
        password: data.hashedPassword,
      },
    });

    return this.toDomain(raw);
  }

  async findById(id: ID): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
    });

    return raw ? this.toDomain(raw) : null;
  }

  async findByEmail(
    email: string,
  ): Promise<(User & { hashedPassword: string }) | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!raw) return null;

    const user = this.toDomain(raw);
    return Object.assign(user, { hashedPassword: raw.password });
  }

  async update(
    id: ID,
    data: {
      nickname?: string;
      image?: string | null;
    },
  ): Promise<User> {
    const raw = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.nickname && { nickname: data.nickname }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });

    return this.toDomain(raw);
  }

  async exists(id: ID): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { nickname },
    });
    return count > 0;
  }

  async saveRefreshToken(
    userId: ID,
    token: string,
    expiresAt: Date,
  ): Promise<void> {}

  async findRefreshToken(
    userId: ID,
    token: string,
  ): Promise<{ expiresAt: Date } | null> {
    return null;
  }

  async deleteRefreshToken(userId: ID, token: string): Promise<void> {}

  private toDomain(raw: any): User {
    return new User({
      id: raw.id,
      email: raw.email,
      nickname: raw.nickname,
      image: raw.image,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
