import { BaseRepository } from "./base-repository";

export class ArticleRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma, prisma.article);
  }

  post = async (articleData) => {
    const postedArticle = await this.model.create({
      data: articleData,
    });
    return postedArticle;
  };

  loadDetail = async (articleId) => {
    const articleDetail = await this.model.findUnique({
      where: { articleId },
    });
    return articleDetail;
  };

  edit = async (articleId, articleData) => {
    const editedArticle = await this.model.update({
      where: { articleId },
      data: articleData,
    });
    return editedArticle;
  };

  delete = async (articleId) => {
    const deletedArticle = await this.model.delete({
      where: { articleId },
    });
    return deletedArticle;
  };

  loadList = async (query) => {
    const { offset = 0, limit = 10, search = "" } = query;
    const condition = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await model.findMany({
      where: condition,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    return articles;
  };
}
