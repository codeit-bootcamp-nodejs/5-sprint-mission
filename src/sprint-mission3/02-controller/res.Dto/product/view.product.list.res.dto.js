export class ViewProductListResDto {
  constructor(productList) {
    this.productList = productList.map(product => ({
      id : product.id,
      name : product.name,
      description : product.description,
      price : product.price,
      tags : product.tags,
      createdAt : product.createdAt,
      updatedAt : product.updatedAt,
    }));
  }
}