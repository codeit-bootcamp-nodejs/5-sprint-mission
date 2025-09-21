import prisma from "../generated/prisma/index.js";

export class ArticleService {
  create = async ({ title, content }) => {
    return prisma.article.create({ data: { title, content } });
  };

  getById = async (id) => {
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });
    if (!article) throw new Error("게시글을 찾을 수 없습니다.");
    return article;
  };

  update = async (id, data) => {
    return prisma.article.update({
      where: { id: Number(id) },
      data,
    });
  };

  delete = async (id) => {
    return prisma.article.delete({
      where: { id: Number(id) },
    });
  };

  list = async ({ skip, take, search, sort }) => {
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderBy = sort === "recent" ? { createdAt: "desc" } : {};

    const items = await prisma.article.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const total = await prisma.article.count({ where });

    return { total, items };
  };
}
