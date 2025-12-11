import { Authenticator } from "../../external/authenticator";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductCommentRequest } from "../../01-inbound/request/req.validator";
import { ProductComment } from "../entity/product.comment.entity";
import { ProductCommentResDto } from "../../01-inbound/response/product.comment.response";





export const createProductCommentService = (repos: IBaseRepository) => {




    const createProductComment = async (dto: ProductCommentRequest) => {
        const { content, productId, userId } = dto;
        const productCommentEntity = ProductComment.createNew({ productId, content, userId });
        const productComment = await repos.productComment.save(productCommentEntity);

        return new ProductCommentResDto(productComment);
    }

    const getProductComments = async (productId: string) => {
        const productComments = await repos.productComment.findProductComments(productId);

        return productComments.map((productComment) => {
            return new ProductCommentResDto(productComment);
        })
    }

    const updateProductComment = async (dto: ProductCommentRequest) => {
        const { content, productId, commentId, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }

        const productComment = await repos.productComment.findProductComment(commentId);
        if (!productComment) {
            throw new Error('Product comment not found.');
        }

        if (productComment.userId !== userId) {
            throw new Error('Unauthorized: You can only update your own comments.');
        }

        productComment.update(content)

        const productCommentEntity = await repos.productComment.update(productComment);
        return new ProductCommentResDto(productCommentEntity);
    }

    const deleteProductComments = async (commentId: string) => {
        await repos.productComment.deleteProductComment(commentId);
    }

    return {
        createProductComment,
        getProductComments,
        updateProductComment,
        deleteProductComments
    }
}

export type ProductCommentServiceType = ReturnType<typeof createProductCommentService>;