import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  #prisma;
  constructor(prisma) { this.#prisma = prisma; }

  async getProfile(userId) {
    const user = await this.#prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, image: true, createdAt: true, updatedAt: true },
    });
    return user;
  }

  async updateProfile(userId, updateData) {
    return this.#prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async changePassword(userId, oldPassword, newPassword) {
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

  async getUserProducts(userId) {
    return this.#prisma.product.findMany({ where: { userId } });
  }
}
