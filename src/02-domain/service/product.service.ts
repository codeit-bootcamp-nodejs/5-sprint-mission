import { IProductService } from "../../01-inbound/port/services/i.product.service";
import { ProductRequest, QueryType } from "../../01-inbound/request/req.validator";
import { ProductResDto } from "../../01-inbound/response/product.res.dto";
import { IBaseRepository } from "../../03-outbound/I.base.repository";
import { Product } from "../entity/product";




export class ProductService implements IProductService {
    #repos

    constructor(repos: IBaseRepository) {
        this.#repos = repos;
    }

    async likeProduct(id: string) {
        const product = await this.#repos.productRepo.findById(id);
        let like = true;
        if (product.isLiked) {
            like = false;
        } else {
            like = true;
        };

        console.log(product.isLiked);
        console.log(like);
        
        const productEntity = await this.#repos.productRepo.likeById(id, like);
        return new ProductResDto(productEntity);
    }

    async getAllProducts(query: QueryType) {
        const productEntities = await this.#repos.productRepo.findAll(query);
        const productDtos = productEntities.map((entity: Product) => new ProductResDto(entity));
        return productDtos;
    }

    async getProduct(id: string) {
        const productEntity = await this.#repos.productRepo.findById(id);
        return new ProductResDto(productEntity);
    }

    async createProduct(dto: ProductRequest) {
        const newProduct = await this.#repos.productRepo.save(dto);

        return new ProductResDto(newProduct);
    }

    async updateProduct(dto: ProductRequest) {
        const updatedProduct = await this.#repos.productRepo.updateById(dto);
        return new ProductResDto(updatedProduct);
    }


    async deleteProduct(id: string) {
        await this.#repos.productRepo.deleteById(id);
    }
}