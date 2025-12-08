import { IBaseRepository } from "../../04-repository/I.base.repository";
import { Authenticator } from "../../external/authenticator";

import { ProductCommentResDto } from "../../02-controller/res-dto/product.comment.res.dto";
import { ProductCommentRequest } from "../../02-controller/req-validator/req.validator";




export interface IProductCommentService {
    createProductComment(dto: ProductCommentRequest): Promise<ProductCommentResDto>
    getProductComments(productId: string): Promise<ProductCommentResDto[]>;
    deleteProductComments(commentId: string): void;
    updateProductComment(dto: ProductCommentRequest): Promise<ProductCommentResDto>
}

export class ProductCommentService implements IProductCommentService {
    #repos

    constructor(repos: IBaseRepository, auth: Authenticator) {
        this.#repos = repos;
    }




    async createProductComment(dto: ProductCommentRequest) {
        const {content, productId, userId } = dto;


        console.log(userId);

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