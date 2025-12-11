import { ProductReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { ProductResDto } from "../../01-inbound/response/product.response";
import { PersistedProduct, Product } from "../entity/product";
import { IBaseRepository } from "../port/I.base.repository";




export class ProductService {
    #repos

    constructor(repos: IBaseRepository) {
        this.#repos = repos;
    }

    async createProduct(dto: ProductReqDto) {
        const productEntity = Product.createNew(dto);
        const newProduct = await this.#repos.product.save(productEntity);
        return new ProductResDto(newProduct);
    }


    async getAllProducts(query: QueryType) {
        const productEntities = await this.#repos.product.findAll(query);
        const productDtos = productEntities.map((entity: PersistedProduct) => new ProductResDto(entity));
        return productDtos;
    }

    async getProduct(id: string) {
        const productEntity = await this.#repos.product.findById(id);
        return new ProductResDto(productEntity);
    }


    async updateProduct(dto: ProductReqDto) {
        const { id, userId, ...data } = dto;
        if (!id) {
            throw new Error("상품 ID가 필요합니다");
        }
        const product = await this.#repos.product.findById(id);
        if (!product){
            throw new Error("상품이 존재하지 않습니다");
        }
    
        if (product.userId !== userId) {
            throw new Error("수정 권한이 없습니다.");
        }

        product.update({
            name: data.name,
            description: data.description,
            price: data.price,
            tags: data.tags,
            userId: userId,
            imageUrl: data.imageUrl,
        })

        const updatedProduct = await this.#repos.product.updateById(product);
        return new ProductResDto(updatedProduct);
    }


    async deleteProduct(id: string, userId: string) {
        const product = await this.#repos.product.findById(id);

        if (!product) {
            throw new Error("상품이 존재하지 않습니다");
        }

        if (product.userId !== userId){
            throw new Error("수정 권한이 없습니다.");
        }

        await this.#repos.product.deleteById(id);
    }


    async likeProduct(id: string) {
        const product = await this.#repos.product.findById(id);
        
        if (product.isLiked) {
            product.unlike();
        } else {
            product.like();
        };
        ;
        const productEntity = await this.#repos.product.like(product);
        return new ProductResDto(productEntity);
    }

}