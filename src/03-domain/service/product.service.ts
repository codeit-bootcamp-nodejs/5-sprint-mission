import { ProductRequest, QueryType } from "../../02-controller/req-validator/req.validator";
import { ProductResDto } from "../../02-controller/res-dto/product.res.dto";
import { IBaseRepository } from "../../04-repository/I.base.repository";
import { Product } from "../entity/product";


export interface IProductService {
    likeProduct(id: string): Promise<ProductResDto>

    getAllProducts(query: QueryType): Promise<ProductResDto[]>

    getProduct(id: string): Promise<ProductResDto>

    createProduct(dto: ProductRequest): Promise<ProductResDto>

    updateProduct(dto: ProductRequest): Promise<ProductResDto>

    deleteProduct(id: string): Promise<void>
}


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