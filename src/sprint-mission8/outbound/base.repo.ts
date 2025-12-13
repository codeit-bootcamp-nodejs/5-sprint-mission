import { Article, PrismaClient } from "@prisma/client";

export class BaseRepo {
  protected _prisma;
  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }
}
