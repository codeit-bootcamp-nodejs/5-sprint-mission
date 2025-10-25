import { ProductReqDto } from "../../02-controller/req-dto/product.req.dto.js";
import { ProductResDto } from "../../02-controller/res-dto/product.res.dto.js";
import { Product } from "../entity/product.js";


export class ProductService {
    #repos

    constructor(repos) {
        this.#repos = repos;
    }

    async likeProduct(id) {
        const product = await this.#repos.productRepo.findById(id);
        let like = true;
        if (product.isLiked) {
            like = false;
        } else {
            like = true;
        };
        
        const productEntity = await this.#repos.productRepo.likeById(id, like);
        return new ProductResDto(productEntity);
    }

    async getAllProducts(query) {
        const productEntities = await this.#repos.productRepo.findAll(query);
        const productDtos = productEntities.map((entity) => new ProductResDto(entity));
        return productDtos;
    }

    async getProduct(id) {
        const productEntity  = await this.#repos.productRepo.findById(id);
        return new ProductResDto(productEntity);
    }

    async createProduct(dto) {
        const query = dto.query;
        const productId = dto.params.productId;
        const productEntity = Product.forCreate(dto);

        const newProduct = await this.#repos.productRepo.save(productEntity, productId, query);

        return new ProductResDto(newProduct);
    }

    async updateProduct(dto) {
        const productEntity = Product.forCreate({
            id: dto.params.id,
            name: dto.name,
            description: dto.description,
            price: dto.price,
            tags: dto.tags,
        });

        const updatedProduct = await this.#repos.productRepo.updateById(productEntity);
        return new ProductResDto(updatedProduct);
    }


    async deleteProduct(id) {
        await this.#repos.productRepo.deleteById(id);
    }
}