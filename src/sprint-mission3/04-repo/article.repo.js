import { BaseRepo } from "./base.repo.js";
import { ArticleMapper } from "./mapper/article.mapper.js";

export class ArticleRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }

  findArticleByTitle = async (title) => {
    const article = await this.prisma.article.findUnique({
      where: {title},
    });
    return article ? ArticleMapper.toEntity(article) : null;
  }

  findArticleById = async (id) => {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });
    return article ? ArticleMapper.toEntity(article) : null;
  }
  findArticleList = async ({ offset, limit, orderBy }) => {
    const articleList = await this.prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: [orderBy],
    });

    return articleList.map(article => ArticleMapper.toEntity(article));
  }

  create = async (entity) => {
    const article = await this.prisma.article.create({
      data: {
        ...ArticleMapper.toPersistent(entity),
      }
    });
    return ArticleMapper.toEntity(article);
  };

  update = async (entity) => {
    const updatedarticle = await this.prisma.article.update({
      where: { id: entity.id },
      data: {
        ...ArticleMapper.toPersistent(entity),
        updatedAt: new Date(),
      }
    });

    return ArticleMapper.toEntity(updatedarticle);
  }

  delete = async (entity) => {
    const deletedArticle = await this.prisma.article.delete({
      where: entity.id
        ? { id: entity.id }
        : { title: entity.title }
    });
    return deletedArticle;
  }

  count = async () => {
    const totalCount = await this.prisma.article.count();

    return totalCount;
  }
}