import { BaseRepository } from "./base.repository.js"
import { Article } from "../03-domain/entity/article.js";



export class ArticleRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma)
    }

    async findAll(query) {

        const { offset = 0, limit = 10, search = "", sort = "desc" } = query;

        const condition = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const articles = await this.prisma.article.findMany({
            where: condition,
            skip: parseInt(offset),
            take: parseInt(limit),
            orderBy: {
                createdAt: sort,
            },
        });

        const articleEntities = articles.map((article) => {
            return Article.forCreate(article);
        });

        return articleEntities;
    }

    async findById(id) {
        const article = await this.prisma.article.findUnique({
            where: {
                id: id,
            },
        });
        return Article.forCreate(article);
    }

    async save(entity) {

        const { id, title, content, createdAt, updatedAt, userId } = entity;

        const article = await this.prisma.article.create({
            data: {
                id: id,
                title: title,
                content: content,
                createdAt: createdAt,
                updatedAt: updatedAt,
                userId : userId
            }
        });

        return Article.forCreate(article);
    }

    async updateById(entity) {
        const { id, title, content, createdAt, updatedAt } = entity;

        const article = await this.prisma.article.update({
            where: { id },
            data: {
                id: id,
                title: title,
                content: content,
                createdAt: createdAt,
                updatedAt: updatedAt
            }
        });

        return Article.forCreate(article);
    }

    async deleteById(id) {
        await this.prisma.article.delete({
            where: {
                id: id,
            },
        });
    }
}