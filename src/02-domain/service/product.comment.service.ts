import { Authenticator } from "../../external/authenticator";
import { IProductCommentService } from "../../01-inbound/port/services/i.product.comment.service";
import { IBaseRepository } from "../port/I.base.repository";
import { ProductCommentRequest } from "../../01-inbound/request/req.validator";





export class ProductCommentService implements IProductCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createProductComment(dto: ProductCommentRequest) {
        const {content, productId, userId } = dto;
        const productCommentResDto = await this.#repos.productComment.save(userId, productId, content);
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

        const productCommentResDto = await this.#repos.productComment.update(userId, productId, commentId, content);
        return productCommentResDto;
    }

}