import { IBaseRepository } from "../../03-outbound/I.base.repository";
import { Authenticator } from "../../external/authenticator";

import { ProductCommentResDto } from "../../01-inbound/response/product.comment.res.dto";
import { ProductCommentRequest } from "../../01-inbound/request/req.validator";
import { IProductCommentService } from "../../01-inbound/port/services/i.product.comment.service";





export class ProductCommentService implements IProductCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createProductComment(dto: ProductCommentRequest) {
        const {content, productId, userId } = dto;
        const productCommentResDto = await this.#repos.productCommentRepo.save(userId, productId, content);
        return productCommentResDto;
    }

    async getProductComments(productId: string) {
        const productCommentResDtos = await this.#repos.productCommentRepo.findProductComments(productId);
        return productCommentResDtos;
    }

    async deleteProductComments(commentId: string) {
        await this.#repos.productCommentRepo.deleteProductComment(commentId);
    }

    async updateProductComment(dto: ProductCommentRequest) {
        const { content, productId, commentId, userId } = dto;
        if (!commentId) {
            throw new Error('Comment ID is required for updating a comment.');
        }

        const productCommentResDto = await this.#repos.productCommentRepo.update(userId, productId, commentId, content);
        return productCommentResDto;
    }

}