import { User, Prisma, PrismaClient } from "@prisma/client";

export type RegisterData = Prisma.UserCreateInput;

export default class AuthRepository {
  private prisma;
  constructor(prisma: PrismaClient){
    this.prisma = prisma;
  }
  async createUser(data: RegisterData): Promise<Omit<User, "password">> {
    const newUser = await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findUserByNickname(nickname: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });
  }
}
