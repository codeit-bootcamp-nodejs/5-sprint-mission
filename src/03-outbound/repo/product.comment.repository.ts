import { PrismaClient } from "@prisma/client/extension";
import { IProductCommentRepository } from "../../02-domain/port/repositories/I.product.comment.repository";
import { Prisma } from "@prisma/client";
import { ProductCommentMapper } from "../mapper/product.comment.mapper";
import { NewProduct, PersistedProduct } from "../../02-domain/entity/product";
import { NewProductComment, PersistedProductComment } from "../../02-domain/entity/product.comment.entity";






export type PersistProductComment = Prisma.ProductCommentGetPayload<{}>;


export const createProductCommentRepository = (prisma: PrismaClient) => {

    const save = async (entity: NewProductComment): Promise<PersistedProductComment> => {
        const { productId, content, userId } = entity;
        const productComment = await prisma.productComment.create({
            data: {
                productId,
                content,
                userId
            }
        });

        return ProductCommentMapper.toPersist(productComment);
    }

    const findProductComments = async (productId: string) => {
        const productComment = await prisma.productComment.findMany({
            where: { productId }
        });

        return productComment.map((record: PersistProductComment) => {
            return ProductCommentMapper.toPersist(record);
        })
    }


    const findProductComment = async (commentId: string): Promise<PersistedProductComment> => {
        const productComment = await prisma.productComment.findUnique({
            where: { id: commentId }
        });
        return ProductCommentMapper.toPersist(productComment);
    }


    const deleteProductComment = async (commentId: string) => {
        await prisma.productComment.delete({
            where: { id: commentId }
        });
    }

    const update = async (entity: PersistedProductComment) => {

        const { userId, productId, content, id } = entity;
        const productComment = await prisma.productComment.update({
            where: { id },
            data: {
                userId,
                productId,
                content
            }
        });

        return ProductCommentMapper.toPersist(productComment);
    }

    return {
        save,
        findProductComments,
        findProductComment,
        deleteProductComment,
        update
    }
}


