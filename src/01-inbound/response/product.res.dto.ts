import { Product } from "@prisma/client"

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

    constructor(entity: Product) {
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