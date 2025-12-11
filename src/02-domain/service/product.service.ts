import { ProductReqDto, QueryType } from "../../01-inbound/request/req.validator";
import { ProductResDto } from "../../01-inbound/response/product.response";
import { PersistedProduct, Product } from "../entity/product";
import { IBaseRepository } from "../port/I.base.repository";




export const createProductService = (repos: IBaseRepository) => {


    const createProduct = async (dto: ProductReqDto) => {
        const productEntity = Product.createNew(dto);
        const newProduct = await repos.product.save(productEntity);
        return new ProductResDto(newProduct);
    }


    const getAllProducts = async (query: QueryType) => {
        const productEntities = await repos.product.findAll(query);
        const productDtos = productEntities.map((entity: PersistedProduct) => new ProductResDto(entity));
        return productDtos;
    }

    const getProduct = async (id: string) => {
        const productEntity = await repos.product.findById(id);
        return new ProductResDto(productEntity);
    }


    const updateProduct = async (dto: ProductReqDto) => {
        const { id, userId, ...data } = dto;
        if (!id) {
            throw new Error("상품 ID가 필요합니다");
        }
        const foundProduct = await repos.product.findById(id);
        if (!foundProduct) {
            throw new Error("상품이 존재하지 않습니다");
        }

        if (foundProduct.userId !== userId) {
            throw new Error("수정 권한이 없습니다.");
        }

        const newProduct = Product.createNew({
            ...data,
            userId
        });

        const updatedProduct = await repos.product.update(foundProduct, newProduct);
        return new ProductResDto(updatedProduct);
    }


    const deleteProduct = async (id: string, userId: string) => {
        const product = await repos.product.findById(id);

        if (!product) {
            throw new Error("상품이 존재하지 않습니다");
        }

        if (product.userId !== userId) {
            throw new Error("수정 권한이 없습니다.");
        }

        await repos.product.deleteById(id);
    }


    const likeProduct = async (id: string) => {
        const product = await repos.product.findById(id);

        if (product.isLiked) {
            product.unlike();
        } else {
            product.like();
        };
        ;
        const productEntity = await repos.product.like(product);
        return new ProductResDto(productEntity);
    }

    return {
        createProduct,
        getAllProducts,
        getProduct,
        updateProduct,
        deleteProduct,
        likeProduct
    }
}

export type ProductServiceType = ReturnType<typeof createProductService>;