import { Product } from "../../domain/entities/product.entity";

export class ProductPresenter {
  toResponse(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      images: product.images,
      userId: product.userId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  toListResponse(products: Product[], total: number) {
    return {
      list: products.map((product) => this.toResponse(product)),
      totalCount: total,
    };
  }

  toCreateResponse(product: Product) {
    return this.toResponse(product);
  }

  toDeleteResponse(id: number) {
    return { id };
  }
}
