export class ProductResDto {
    id
    name
    description
    price
    tags
    createdAt
    updatedAt

    constructor({ id, name, description, price, tags, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}