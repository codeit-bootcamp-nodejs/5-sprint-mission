import { Exception } from "../../common/const/exception.js";
import { Product } from "../entity/product.js";

export class ProductService {
  #repos;

  constructor(repos) {
    this.#repos = repos;
  }

  viewProduct = async ({ name }) => {
    const foundProduct = await this.#repos.product.findProductByname(name);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    return foundProduct;
  };

  viewProductList = async ({ offset, limit, sort }) => {
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
      throw new Exception("LIMIT_OVERFLOW", { totalCount: productTotalCount });
    }

    const foundProductList = await this.#repos.product.findProductList({
      offset,
      limit,
      orderBy,
    });

    return foundProductList;
  };

  createProduct = async ({ name, description, price, tags }) => {
    const foundProduct = await this.#repos.product.findProductByname(name);
    if (foundProduct) {
      throw new Exception("PRODUCT_ALREADY_EXIST");
    }
    const product = Product.createFactory({ name, description, price, tags });

    const createdProduct = await this.#repos.product.create(product);

    return createdProduct;
  };

  updateProduct = async ({ id, name, description, price, tags }) => {
    const foundProduct = await this.#repos.product.findProductById(id);
    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }

    const product = Product.updateFactory({
      id,
      name,
      description,
      price,
      tags,
    });

    const updatedProduct = await this.#repos.product.update(product);

    return updatedProduct;
  };

  deleteProduct = async ({ id, name }) => {
    const foundProduct = id
      ? await this.#repos.product.findProductById(id)
      : await this.#repos.product.findProductByname(name);

    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }
    const product = Product.deleteFactory({ id, name });
    const deletedProduct = await this.#repos.product.delete(product);
    return deletedProduct;
  };
}
