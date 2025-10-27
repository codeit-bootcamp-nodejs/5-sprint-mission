export class ProductLikeResDto {
  constructor(getProduct) {
    this.ownerId = getProduct.userId;
    this.id = getProduct.id;
    this.name = getProduct.name;
    this.description = getProduct.description;
    this.price = getProduct.price;
    this.tags = getProduct.tags;
    this.isLiked = getProduct.isLiked;
    this.createdAt = getProduct.createdAt;
    this.updatedAt = getProduct.updatedAt;
  }
}
