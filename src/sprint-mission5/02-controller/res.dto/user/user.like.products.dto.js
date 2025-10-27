export class UserLikeProductsResDto {
  products;
  constructor(likeProducts) {
    this.products = likeProducts.map((product) => ({
      ownerId: product.userId,
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      isLiked: product.isLiked,
    }));
  }
}
