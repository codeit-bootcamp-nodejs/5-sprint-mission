import { Prisma, PrismaClient } from "@prisma/client";
import { QueryType } from "../../../01-inbound/request/query.request";
import { ArticleView } from "../../../02-application/query/view/article.view";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { IProductQueryRepository } from "../../../02-application/port/repositories/query/I.product.query.repository";
import { ProductView } from "../../../02-application/query/view/product.view";

export const createProductQueryRepository = (
    prisma: PrismaClient,
): IProductQueryRepository => {
    const findAll = async (query: QueryType): Promise<ProductView[]> => {



        const { offset = 0, limit = 10, search = "", sort = "desc" } = query;
        const condition: Prisma.ProductWhereInput = search
            ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};



        const products = await prisma.product.findMany({
            where: condition,
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: sort ? "desc" : "asc",
            },
            include: {
                User: true,
                ProductComment: {
                    include: {
                        user: true
                    }
                }
            }
        });



        if (!products) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            })
        }

        return products.map((product) => {
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                tags: product.tags,
                imageUrl: product.imageUrl ?? undefined,
                likeCount: product.likeCount,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                author: {
                    nickname: product.User.nickname
                },
                comments: product.ProductComment.map((productComment) => {
                    return {
                        nickname: productComment.user.nickname,
                        content: productComment.content
                    }

                })
            }

        })

    };


    const findById = async (id: string): Promise<ProductView> => {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                User: true,
                ProductComment: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!product) {
            throw BusinessException({
                type: BusinessExceptionType.DATA_NOT_FOUND
            });
        }



        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            tags: product.tags,
            imageUrl: product.imageUrl ?? undefined,
            likeCount: product.likeCount,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            author: {
                nickname: product.User.nickname
            },
            comments: product.ProductComment.map((productComment) => {
                return {
                    nickname: productComment.user.nickname,
                    content: productComment.content
                }

            })
        }
    };


    return {
        findAll,
        findById,
    };
};
