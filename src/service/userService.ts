import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignupDto, LoginDto, UpdateProfileDto } from "../common/dto";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET ?? "refresh_secret";

export class UserService {
  #prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async signup({ email, nickname, password }: SignupDto) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.#prisma.user.create({
      data: { email, nickname, password: hashed },
    });
    return { id: user.id, email: user.email, nickname: user.nickname };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.#prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, {
      expiresIn: "1h",
    });

    await this.#prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        userId: string;
      };
      const tokens = {
        accessToken: jwt.sign({ userId: decoded.userId }, ACCESS_SECRET, {
          expiresIn: "15m",
        }),
        refreshToken: jwt.sign({ userId: decoded.userId }, REFRESH_SECRET, {
          expiresIn: "1h",
        }),
      };
      await this.#prisma.user.update({
        where: { id: decoded.userId },
        data: { refreshToken: tokens.refreshToken },
      });
      return tokens;
    } catch {
      throw new Error("Refresh Token 유효하지 않음");
    }
  }

  async getProfile(userId: string) {
    return this.#prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    return this.#prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.#prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new Error("Incorrect password");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    return this.#prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });
  }

  async getUserProducts(userId: string) {
    return this.#prisma.product.findMany({ where: { userId } });
  }
}
