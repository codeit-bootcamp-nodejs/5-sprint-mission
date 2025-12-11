import { PrismaClient } from "@prisma/client/extension";
import { BaseRepository } from "./base.repository";
import { IProductCommentRepository } from "../../02-domain/port/repositories/I.product.comment.repository";
import { ProductCommentResDto } from "../../01-inbound/response/product.comment.response";
import { Prisma } from "@prisma/client";
import { ProductCommentMapper } from "../mapper/product.comment.mapper";
import { NewProduct, PersistedProduct } from "../../02-domain/entity/product";
import { NewProductComment, PersistedProductComment } from "../../02-domain/entity/product.comment.entity";






export type PersistProductComment = Prisma.ProductCommentGetPayload<{}>;


export class ProductCommentRepository extends BaseRepository implements IProductCommentRepository {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async save(entity: NewProductComment): Promise<PersistedProductComment> {
        const { productId, content, userId } = entity;
        const productComment = await this.prisma.productComment.create({
            data: {
                productId,
                content,
                userId
            }
        });

        return ProductCommentMapper.toPersist(productComment);
    }

    async findProductComments(productId: string) {
        const productComment = await this.prisma.productComment.findMany({
            where: { productId }
        });

        return productComment.map((record: PersistProductComment) => {
            return ProductCommentMapper.toPersist(record);
        })
    }


    async findProductComment(commentId: string): Promise<PersistedProductComment> {
        const productComment = await this.prisma.productComment.findUnique({
            where: { id: commentId }
        });
        return ProductCommentMapper.toPersist(productComment);
    }


    async deleteProductComment(commentId: string) {
        await this.prisma.productComment.delete({
            where: { id: commentId }
        });
    }

    async update(entity: PersistedProductComment) {

        const { userId, productId, content, id } = entity;
        const productComment = await this.prisma.productComment.update({
            where: { id },
            data: {
                userId,
                productId,
                content
            }
        });

        return ProductCommentMapper.toPersist(productComment);
    }
}


