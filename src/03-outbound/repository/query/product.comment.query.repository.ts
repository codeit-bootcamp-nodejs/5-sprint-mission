import { PrismaClient } from "@prisma/client";
import { IProductCommentQueryRepository } from "../../../02-application/port/repositories/query/I.product.comment.query.repository";
import { ProductCommentView } from "../../../02-application/query/view/product.comment.view";

export const createProductCommentQueryRepository = (
    prisma: PrismaClient
): IProductCommentQueryRepository => {
    const findAll = async (id: string): Promise<ProductCommentView[]> => {
        const productComments = await prisma.productComment.findMany({
            where: {
                productId: id
            },
            include: {
                product: true,
                user: true
            }
        })

        return productComments.map((productComment) => {
            return {
                id: productComment.id,
                productName: productComment.product.name,
                content: productComment.content,
                createdAt: productComment.createdAt,
                updatedAt: productComment.updatedAt,
                author: {
                    nickname: productComment.user.nickname
                }
            }
        })

    }

    return {
        findAll
    }
}