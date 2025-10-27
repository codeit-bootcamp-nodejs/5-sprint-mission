export class BaseRepo {
  prisma;
  constructor(prisma) {
    this.prisma = prisma;
  }
}
