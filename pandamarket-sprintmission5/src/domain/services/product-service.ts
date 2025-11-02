import { UploadProductDto } from "../../dto/product/create-product.dto";
import { EditProductDto } from "../../dto/product/edit-product.dto";
import { IRepository, PaginationQuery } from "../../repositories/repository";
import { PersistedProductEntity } from "../entity/proudct-entity";
import { BaseService } from "./base-service";

export interface IProductService {
  uploadProduct: (
    productData: UploadProductDto,
    userId: number,
  ) => Promise<PersistedProductEntity>;
  getProducts: (query: PaginationQuery) => Promise<PersistedProductEntity[]>;
  getProductDetail: (
    productId: number,
  ) => Promise<PersistedProductEntity | null>;
  editProduct: (
    productId: number,
    userId: number,
    productData: EditProductDto,
  ) => Promise<PersistedProductEntity>;
  deleteProduct: (productId: number) => Promise<boolean>;
  getMyProducts(userId: number, query: PaginationQuery): Promise<PersistedProductEntity[]>
  likeProduct(productId: number, userId: number): Promise<void>
  unlikeProduct(productId: number, userId: number): Promise<void>
}

export class ProductService extends BaseService implements IProductService {
  constructor(repository: IRepository) {
    super(repository);
  }

  async uploadProduct(productData: UploadProductDto, userId: number) {
    if (!productData.name || !productData.price) {
      throw new Error("상품명과 가격은 필수입니다.");
    }

    const productDatawithUserId = { ...productData, userId };
    const product = await this.repository.product.upload(productDatawithUserId);

    return product;
  }

  async getProducts(query: PaginationQuery) {
    const processedQuery = {
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };
    const products = await this.repository.product.loadAllProducts(processedQuery);

    return products;
  }

  async getProductDetail(productId: number) {
    const product = await this.repository.product.loadDetail(productId);
    if (!product) throw new Error("존재하지 않는 상품입니다.");
    return product;
  }

  async editProduct(
    productId: number,
    userId: number,
    productData: EditProductDto,
  ) {
    const existing = await this.repository.product.loadDetail(productId);
    if (!existing) throw new Error("존재하지 않는 상품입니다.");

    const productDatawithUserId = { ...productData, userId };

    const updated = await this.repository.product.edit(
      productId,
      productDatawithUserId,
    );
    return updated;
  }

  async deleteProduct(productId: number) {
    const existing = await this.repository.product.loadDetail(productId);
    if (!existing) throw new Error("존재하지 않는 상품입니다.");

    await this.repository.product.delete(productId);
    return true;
  }

  async getMyProducts(userId: number, query: PaginationQuery) {
    const processedQuery = {
      offset: Number(query.offset) || 0,
      limit: Number(query.limit) || 10,
    };

    return await this.repository.product.loadUserProducts(userId, processedQuery);
  }

  async likeProduct(productId: number, userId: number) {
    const productExists = await this.repository.product.loadDetail(productId);
    if (!productExists) throw new Error("좋아요할 상품을 찾을 수 없습니다.");

    const existingFavorite = await this.repository.product.findFavorite(
      productId,
      userId
    );
    if (existingFavorite) {
      throw new Error("이미 좋아요를 누른 상품입니다.");
    }

    const favorite = await this.repository.product.createFavorite(
      productId,
      userId
    );

    return;
  }

  async unlikeProduct(productId: number, userId: number) {
    const existingFavorite = await this.repository.product.findFavorite(
      productId,
      userId
    );
    if (!existingFavorite) {
      throw new Error("취소할 좋아요 기록을 찾을 수 없습니다.");
    }

    await this.repository.product.deleteFavorite(productId, userId);
    return;
  }
}
