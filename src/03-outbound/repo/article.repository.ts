import { Article, NewArticleEntity, PersistArticleEntity } from "../../02-domain/entity/article";
import { Prisma, PrismaClient } from "@prisma/client";
import { ArticleReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { IArticleRepository } from "../../02-domain/port/repositories/I.article.repository";
import { ArticleMapper } from "../mapper/article.mapper";




export type PersistArticle = Prisma.ArticleGetPayload<{}>;


export const createArticleRepository = (prisma: PrismaClient) => {

    const findAll = async (query: QueryType) => {

        const { offset, limit, search, sort } = query;

        const condition: Prisma.ArticleWhereInput = search
            ? {
                OR: [
                    { title: { contains: search, mode: "insensitive" } },
                    { content: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};

        const articles = await prisma.article.findMany({
            where: condition,
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: sort ? "desc" : "asc",
            },
        });

        const articleEntities = articles.map((article: PersistArticle) => {
            return ArticleMapper.toPersist(article);
        });

        return articleEntities;
    }


    const findById = async (id: string) => {
        const article = await prisma.article.findUnique({
            where: { id },
        });

        if (!article) {
            throw new Error("글을 찾을 수 없습니다.");
        }

        return ArticleMapper.toPersist(article);
    }



    const save = async (entity: NewArticleEntity) => {
        const { title, content, userId } = entity;

        const article = await prisma.article.create({
            data: {
                title,
                content,
                userId
            }
        });

        return ArticleMapper.toPersist(article);
    }

    const updateArticle = async (foundEntity: PersistArticleEntity, newEntity: NewArticleEntity) => {
        const { id } = foundEntity;
        const { title, content } = newEntity;

        const article = await prisma.article.update({
            where: { id },
            data: {
                title,
                content,
            }
        });

        return ArticleMapper.toPersist(article);
    }

    const deleteById = async (id: string) => {
        await prisma.article.delete({
            where: { id }
        });
    }

    return {
        findAll,
        findById,
        save,
        updateArticle,
        deleteById
    }
}