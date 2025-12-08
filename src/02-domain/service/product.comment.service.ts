import { Authenticator } from "../../external/authenticator";
import { IProductCommentService } from "../../01-inbound/port/services/i.product.comment.service";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductCommentRequest } from "../../01-inbound/request/req.validator";
import { ProductComment } from "../entity/product.comment.entity";





export class ProductCommentService implements IProductCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createProductComment(dto: ProductCommentRequest) {
        const { content, productId, userId } = dto;
        const productComment = ProductComment.createNew({ productId, content, userId });
        const productCommentResDto = await this.#repos.productComment.save(productComment);
        await this.#repos.notification.createProductCommentNotification(userId);
        return productCommentResDto;
    }

    async getProductComments(productId: string) {
        const productCommentResDtos = await this.#repos.productComment.findProductComments(productId);
        return productCommentResDtos;
    }

    async deleteProductComments(commentId: string) {
        await this.#repos.productComment.deleteProductComment(commentId);
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

        const productCommentResDto = await this.#repos.productComment.update(productComment);
        return productCommentResDto;
    }

}