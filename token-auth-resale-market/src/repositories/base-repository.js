export class BaseRepository {
  prisma;

  constructor(prisma, model) {
    this.prisma = prisma;
    this.model = model;
  }
  async findId(id) {
    return this.prisma.model.findUnique({ where: { id } });
  }
}
