export class UpdateProductResDto{
  constructor(updateProduct){
    this.id = updateProduct.id;
    this.name = updateProduct.name;
    this.description = updateProduct.description;
    this.price = updateProduct.price;
    this.tags = updateProduct.tags;
    this.createdAt = updateProduct.createdAt;
    this.updatedAt = updateProduct.updatedAt;
  }
}