import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  create(data: { email: string; nickname: string; password: string }) {
    return prisma.user.create({ data });
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  updateProfile(id: number, data: Partial<User>) {
    return prisma.user.update({ where: { id }, data });
  }
}
