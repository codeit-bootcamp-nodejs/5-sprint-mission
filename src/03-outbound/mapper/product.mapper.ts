import { PersistedProduct, Product } from "../../02-domain/entity/product";
import { PersistProduct } from "../repo/product.repository";

export class ProductMapper {
    static toPersist(product: PersistProduct): PersistedProduct {
        return new Product({
            id: product.id,
            name: product.name, 
            description: product.description,
            price: product.price,
            tags: product.tags, 
            userId: product.userId,
            isLiked: false,
            imageUrl: product.imageUrl ?? undefined,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }) as PersistedProduct;
    }
}