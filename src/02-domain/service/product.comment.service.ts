import { Authenticator } from "../../external/authenticator";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductCommentRequest } from "../../01-inbound/request/req.validator";
import { ProductComment } from "../entity/product.comment.entity";
import { ProductCommentResDto } from "../../01-inbound/response/product.comment.response";





export class ProductCommentService {
    #repos

    constructor(repos: IBaseRepository) {
        this.#repos = repos;
    }




    async createProductComment(dto: ProductCommentRequest) {
        const { content, productId, userId } = dto;
        const productCommentEntity = ProductComment.createNew({ productId, content, userId });
        const productComment = await this.#repos.productComment.save(productCommentEntity);

        return new ProductCommentResDto(productComment);
    }

    async getProductComments(productId: string) {
        const productComments = await this.#repos.productComment.findProductComments(productId);

        return productComments.map((productComment) => {
            return new ProductCommentResDto(productComment);
        })
    }

    async updateProductComment(dto: ProductCommentRequest) {
        const { content, productId, commentId, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }

        const productComment = await this.#repos.productComment.findProductComment(commentId);
        if (!productComment) {
            throw new Error('Product comment not found.');
        }

        if (productComment.userId !== userId) {
            throw new Error('Unauthorized: You can only update your own comments.');
        }

        productComment.update(content)

        const productCommentEntity = await this.#repos.productComment.update(productComment);
        return new ProductCommentResDto(productCommentEntity);
    }

    async deleteProductComments(commentId: string) {
        await this.#repos.productComment.deleteProductComment(commentId);
    }


}