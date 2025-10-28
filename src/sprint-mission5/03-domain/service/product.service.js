import { Exception } from "../../common/const/exception.js";
import { Product } from "../entity/product.js";

export class ProductService {
  #repos;

  constructor(repos) {
    this.#repos = repos;
  }

  getProduct = async ({ productId }) => {
    const foundProduct = await this.#repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    return foundProduct;
  };

  getProductList = async ({ offset, limit, sort }) => {
    const orderBy =
      sort === "recent"
        ? { updatedAt: "desc" }
        : sort === "priceLowest"
          ? { price: "asc" }
          : { price: "desc" };

    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const productTotalCount = await this.#repos.product.count();
    if (productTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW",productTotalCount);
    }

    const foundProductList = await this.#repos.product.findProductList({
      offset,
      limit,
      orderBy,
    });

    return foundProductList;
  };

  addProductLike = async ({ userId, productId }) => {
    const foundProduct = await this.#repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    const existingLike = await this.#repos.product.findProductLike(
      userId,
      productId,
    );
    if (existingLike) {
      if (!existingLike.isLiked) {
        return this.#repos.product.updateProductLike(userId, productId, true);
      }
      throw new Exception("LIKE_EXIST");
    }

    return this.#repos.product.addProductLike(userId, productId);
  };

  createProduct = async ({ userId, name, description, price, tags }) => {
    const foundProduct = await this.#repos.product.findProductByName(name);
    if (foundProduct) {
      throw new Exception("PRODUCT_ALREADY_EXIST");
    }
    const product = Product.createFactory({
      userId,
      name,
      description,
      price,
      tags,
    });

    const createdProduct = await this.#repos.product.create(product);

    return createdProduct;
  };

  updateProduct = async ({
    userId,
    productId,
    name,
    description,
    price,
    tags,
  }) => {
    const foundProduct = await this.#repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    if (userId !== foundProduct.userId) {
      throw new Exception("UNAUTHORIZED_PRODUCT_OWNER");
    }
    const product = Product.updateFactory({
      productId,
      name,
      description,
      price,
      tags,
    });

    const updatedProduct = await this.#repos.product.update(product);

    return updatedProduct;
  };

  deleteProduct = async ({ userId, productId }) => {
    const foundProduct = await this.#repos.product.findProductById(productId);

    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }
    if (userId !== foundProduct.userId) {
      throw new Exception("UNAUTHORIZED_PRODUCT_OWNER");
    }

    const deletedProduct = await this.#repos.product.delete(productId);
    return deletedProduct;
  };

  cancelProductLike = async ({ userId, productId }) => {
    const foundProduct = await this.#repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    const existingLike = await this.#repos.product.findProductLike(
      userId,
      productId,
    );
    if (!existingLike) {
      throw new Exception("LIKE_NOT_EXIST");
    }

    return this.#repos.product.cancelProductLike(userId, productId, false);
  };
}
