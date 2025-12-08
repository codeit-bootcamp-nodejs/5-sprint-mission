import { BaseRepository } from "./base.repository"
import { Article } from "../../02-domain/entity/article";
import { PrismaClient } from "@prisma/client/extension";
import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { IArticleRepository } from "../../02-domain/port/repositories/I.article.repository";


export class ArticleRepository extends BaseRepository implements IArticleRepository {
    constructor(prisma: PrismaClient) {
        super(prisma)
    }

    async findAll(query: QueryType) {

        const { offset, limit, search, sort } = query;

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
            skip: offset,
            orderBy: {
                createdAt: sort,
            },
        });

        const articleEntities = articles.map((article: Article) => {
            return Article.forCreate(article);
        });

        return articleEntities;
    }

    async findById(id: string) {
        const article = await this.prisma.article.findUnique({
            where: { id },
        });
        return Article.forCreate(article);
    }

    async save(dto: ArticleReqDto) {
        const { title, content, userId } = dto;


        const article = await this.prisma.article.create({
            data: {
                title: title,
                content: content,
                userId: userId
            }
        });

        return Article.forCreate(article);
    }

    async updateById(dto: ArticleReqDto) {
        console.log(dto);
        const { id, title, content } = dto;

        const article = await this.prisma.article.update({
            where: { id },
            data: {
                id: id,
                title: title,
                content: content,
            }
        });

        return Article.forCreate(article);
    }

    async deleteById(id: string) {
        await this.prisma.article.delete({
            where: {
                id: id,
            },
        });
    }
}