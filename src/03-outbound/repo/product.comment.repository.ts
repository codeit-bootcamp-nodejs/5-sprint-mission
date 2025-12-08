import { PrismaClient } from "@prisma/client/extension";
import { BaseRepository } from "./base.repository";
import { ProductCommentResDto } from "../../01-inbound/response/product.comment.res.dto";



export interface IProductCommentRepository {
    save(userId: string, productId: string, content: string): Promise<ProductCommentResDto>
    findProductComments(productId: string): Promise<ProductCommentResDto[]>;
    deleteProductComment(commentId: string): void;
    update(userId: string, productId: string, commentId: string, content: string): Promise<ProductCommentResDto>
}

export class ProductCommentRepository extends BaseRepository implements IProductCommentRepository {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async save(userId: string, productId: string, content: string) {
        const productComment = await this.prisma.productComment.create({
            data: {
                userId,
                productId,
                content
            }
        });

        return new ProductCommentResDto(productComment);
    }

    async findProductComments(productId: string) {
        const productComment = await this.prisma.productComment.findMany({
            where: { productId }
        });

        const productResDtos = productComment.map((record: any) => {
            return new ProductCommentResDto(record);
        })

        return productResDtos;
    }

    async deleteProductComment(commentId: string) {
        await this.prisma.productComment.delete({
            where: { id: commentId }
        });
        console.log(`Deleted ${commentId}`);

    }

    async update(userId: string, productId: string, commentId: string, content: string) {
        const productComment = await this.prisma.productComment.update({
            where: {id :commentId},
            data: {
                userId,
                productId,
                content
            }
        });

        return new ProductCommentResDto(productComment);
    }
}


