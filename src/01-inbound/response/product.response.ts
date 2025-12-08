import { Product } from "@prisma/client"
import { PersistedProduct } from "../../02-domain/entity/product"

export class ProductResDto {
    id
    name
    description
    price
    tags
    createdAt
    updatedAt
    userId
    isLiked

    constructor(entity: PersistedProduct) {
        this.id = entity.id;
        this.name = entity.name;
        this.description = entity.description;
        this.price = entity.price;
        this.tags = entity.tags;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.userId = entity.userId;
        this.isLiked = entity.isLiked;
    }
}