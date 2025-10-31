import { IRepos } from "../../04-repo/repos";
import { EXCEPTIONS } from "../../common/const/exception.info";
import { Exception } from "../../common/exception/exception.js";
import { BaseQueryType, ProductKeys, ProductSort, Sort } from "../../types/query";
import { PersistedProductEntity, ProductEntity } from "../entity/product.entity";
import { BaseService } from "./base.service";

export interface IProductService {
  getProduct: ({ productId }: GetProductParamsType) => Promise<PersistedProductEntity>;
  getProductList: ({ offset, limit, sort }: BaseProductQueryType) => Promise<PersistedProductEntity[]>;
  addProductLike: ({ userId, productId }: AddProductParamsType) => Promise<PersistedProductEntity>;
  createProduct: ({ userId, name, description, price, tags }: CreateProductParamsType) => Promise<PersistedProductEntity>;
  updateProduct: ({ userId, productId, name, description, price, tags, }: BaseProductParamsType) => Promise<PersistedProductEntity>;
  deleteProduct: ({ userId, productId }: DeleteProductParamsType) => Promise<void>;
  cancelProductLike: ({ userId, productId }: CancelProductParamsType) => Promise<PersistedProductEntity>;
}
type BaseProductQueryType = BaseQueryType<ProductSort>;
type BaseProductParamsType = {
  userId: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
}
type GetProductParamsType = Pick<BaseProductParamsType, "productId">;
type AddProductParamsType = Pick<BaseProductParamsType, "userId" | "productId">;
type CreateProductParamsType = Omit<BaseProductParamsType, "productId">;
type UpdateProductParamsType = BaseProductParamsType;
type DeleteProductParamsType = Pick<BaseProductParamsType, "userId" | "productId">;
type CancelProductParamsType = Pick<BaseProductParamsType, "userId" | "productId">;

export class ProductService extends BaseService implements IProductService {

  constructor(repos: IRepos) {
    super(repos);
  }

  getProduct = async ({ productId }: GetProductParamsType) => {
    const foundProduct = await this._repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    return foundProduct;
  };

  getProductList = async ({ offset, limit, sort }: BaseProductQueryType) => {
    const orderBy: { field: ProductKeys, sort: Sort } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : sort === "price-lowest"
          ? {
            field: "price",
            sort: "asc"
          }
          : {
            field: "price",
            sort: "desc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const productTotalCount = await this._repos.product.count();
    if (productTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: productTotalCount });
    }

    const foundProductList = await this._repos.product.findProductList({
      offset,
      limit,
      orderBy,
    });

    return foundProductList;
  };

  addProductLike = async ({ userId, productId }: AddProductParamsType) => {
    const foundProduct = await this._repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    const existingLike = await this._repos.product.findProductLike(
      userId,
      productId,
    );
    if (existingLike) {
      if (!existingLike.isLiked) {
        return this._repos.product.updateProductLike(userId, productId, true);
      }
      throw new Exception({ info: EXCEPTIONS.LIKE_EXIST });
    }

    return this._repos.product.addProductLike(userId, productId);
  };

  createProduct = async ({ userId, name, description, price, tags }: CreateProductParamsType) => {
    const foundProduct = await this._repos.product.findProductByName(name);
    if (foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_ALREADY_EXIST });
    }
    const product = ProductEntity.createFactory({
      userId,
      name,
      description,
      price,
      tags,
    });

    const createdProduct = await this._repos.product.create(product);

    return createdProduct;
  };

  updateProduct = async ({
    userId,
    productId,
    name,
    description,
    price,
    tags,
  }: UpdateProductParamsType) => {
    const foundProduct = await this._repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    if (userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }
    const product = ProductEntity.updateFactory({
      userId,
      productId,
      name,
      description,
      price,
      tags,
    });

    const updatedProduct = await this._repos.product.update(product);

    return updatedProduct;
  };

  deleteProduct = async ({ userId, productId }: DeleteProductParamsType) => {
    const foundProduct = await this._repos.product.findProductById(productId);

    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }
    if (userId !== foundProduct.userId) {
      throw new Exception({ info: EXCEPTIONS.UNAUTHORIZED_PRODUCT_OWNER });
    }

    const deletedProduct = await this._repos.product.delete(productId);
    return deletedProduct;
  };

  cancelProductLike = async ({ userId, productId }: CancelProductParamsType) => {
    const foundProduct = await this._repos.product.findProductById(productId);
    if (!foundProduct) {
      throw new Exception({ info: EXCEPTIONS.PRODUCT_NOT_EXIST });
    }

    const existingLike = await this._repos.product.findProductLike(
      userId,
      productId,
    );
    if (!existingLike) {
      throw new Exception({ info: EXCEPTIONS.LIKE_NOT_EXIST });
    }

    return this._repos.product.updateProductLike(userId, productId, false);
  };
}
