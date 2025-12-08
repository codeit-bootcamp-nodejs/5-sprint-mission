import { BaseRepository } from "./base.repository"
import { Article, NewArticleEntity, PersistArticleEntity } from "../../02-domain/entity/article";
import { Prisma, PrismaClient } from "@prisma/client";
import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { IArticleRepository } from "../../02-domain/port/repositories/I.article.repository";
import { ArticleMapper } from "../mapper/article.mapper";




export type PersistArticle = Prisma.ArticleGetPayload<{}>;


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
            take: limit,
            orderBy: {
                createdAt: sort,
            },
        });

        const articleEntities = articles.map((article: PersistArticle) => {
            return ArticleMapper.toPersist(article);
        });

        return articleEntities;
    }


    async findById(id: string) {
        const article = await this.prisma.article.findUnique({
            where: { id },
        });
        return ArticleMapper.toPersist(article);
    }



    async save(entity: NewArticleEntity) {
        const { title, content, userId } = entity;

        const article = await this.prisma.article.create({
            data: {
                title,
                content,
                userId
            }
        });

        return ArticleMapper.toPersist(article);
    }

    async updateArticle(entity: PersistArticleEntity) {
        const { id, title, content } = entity;

        const article = await this.prisma.article.update({
            where: { id },
            data: {
                title,
                content,
            }
        });

        return ArticleMapper.toPersist(article);
    }

    async deleteById(id: string) {
        await this.prisma.article.delete({
            where: { id }
        });
    }
}