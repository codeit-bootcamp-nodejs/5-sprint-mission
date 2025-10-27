import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserService {
  async signup({ email, nickname, password }) {
    const hashed = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { email, nickname, password: hashed },
      select: { id: true, email: true, nickname: true, createdAt: true }
    });
  }

  async signin({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!stored) throw new Error("Refresh Token이 유효하지 않습니다.");

      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      return { accessToken };
    } catch {
      throw new Error("Refresh Token이 유효하지 않습니다.");
    }
  }

  async getMe(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, image: true, createdAt: true }
    });
  }

  async updateProfile(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, nickname: true, image: true }
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new Error("기존 비밀번호가 올바르지 않습니다.");
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return true;
  }

  async listMyProducts(userId, { skip, take }) {
    return prisma.product.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, price: true, createdAt: true }
    });
  }
}
