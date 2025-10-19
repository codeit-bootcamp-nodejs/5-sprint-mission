import { Exception } from "../../common/const/exception.js";
import { Product } from "../entity/product.js";

export class ProductService {
  #productRepo;

  constructor(productRepo) {
    this.#productRepo = productRepo;
  }

  viewProduct = async ({ name }) => {
    const foundProduct = await this.#productRepo.findProductByname(name);
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

    const productTotalCount = await this.#productRepo.count();
    if (productTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: productTotalCount });
    }

    const foundProductList = await this.#productRepo.findProductList({
      offset,
      limit,
      orderBy,
    });

    return foundProductList;
  };

  createProduct = async ({ name, description, price, tags }) => {
    const foundProduct = await this.#productRepo.findProductByname(name);
    if (foundProduct) {
      throw new Exception("PRODUCT_ALREADY_EXIST");
    }
    const product = Product.createFactory({ name, description, price, tags });

    const createdProduct = await this.#productRepo.create(product);

    return createdProduct;
  };

  updateProduct = async ({ id, name, description, price, tags }) => {
    const foundProduct = await this.#productRepo.findProductById(id);
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

    const updatedProduct = await this.#productRepo.update(product);

    return updatedProduct;
  };

  deleteProduct = async ({ id, name }) => {
    const foundProduct = id
      ? await this.#productRepo.findProductById(id)
      : await this.#productRepo.findProductByname(name);

    if (!foundProduct) {
      throw new Exception("PRODUCT_NOT_EXIST");
    }
    const product = Product.deleteFactory({ id, name });
    const deletedProduct = await this.#productRepo.delete(product);
    return deletedProduct;
  };
}
