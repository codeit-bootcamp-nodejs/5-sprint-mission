import LoadProductRes from "../dto/load-product-res.js";
import LoadProductIdRes from "../dto/load-productId-res.js";
import LoadProductsRes from "../dto/load-products-res.js";
import Product from "../entity/product.js";

export default class ProductService {
  #productRepository;

  constructor(productRepository) {
    this.#productRepository = productRepository;
  }

  async loadProducts(params) {
    const products = await this.#productRepository.getProductList(params);
    return new LoadProductsRes(products);
  }

  async loadElectronicProducts(params) {
    const products = await this.#productRepository.getElectronicList(params);
    return new LoadProductsRes(products);
  }
  async loadProduct(id) {
    const product = await this.#productRepository.getProduct(id);
    if (!product) {
      return null;
    }
    return new LoadProductRes(
      product.id,
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images,
      product.createdAt,
      product.updatedAt,
    );
  }

  async createProduct(surveyData) {
    const newProduct = await this.#productRepository.createProduct(surveyData);
    if (!newProduct) {
      return null;
    }
    return new LoadProductRes(
      newProduct.id,
      newProduct.name,
      newProduct.description,
      newProduct.price,
      newProduct.tags,
      newProduct.images,
      newProduct.createdAt,
      newProduct.updatedAt,
    );
  }

  async updateProduct(id, surveyData) {
    const updatedProduct = await this.#productRepository.patchProduct(
      id,
      surveyData,
    );
    if (!updatedProduct) {
      return null;
    }
    return new LoadProductRes(
      updatedProduct.id,
      updatedProduct.name,
      updatedProduct.description,
      updatedProduct.price,
      updatedProduct.tags,
      updatedProduct.images,
      updatedProduct.createdAt,
      updatedProduct.updatedAt,
    );
  }

  async deleteProduct(id) {
    const deleteProduct = await this.#productRepository.deleteProduct(id);
    if (!deleteProduct) {
      return null;
    }
    return new LoadProductIdRes(deleteProduct.id);
  }

  async favoritePush(product) {
    const entityProduct = new Product(
      product.id,
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images,
      product.createdAt,
      product.updatedAt,
      product.favoriteCount,
    );

    entityProduct.favorite();
    product.favoriteCount = entityProduct.favoriteCount;

    return product.favoriteCount;
  }
}
