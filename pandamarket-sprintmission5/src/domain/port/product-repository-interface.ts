import { Favorite } from "@prisma/client";
import { UploadProductDto } from "../../dto/product/create-product.dto";
import { EditProductDto } from "../../dto/product/edit-product.dto";
import { PaginationQuery } from "../../repositories/repository";
import { FavoriteProductWithLike, PersistedProductEntity } from "../entity/proudct-entity";

export interface IProductRepository {
  upload(productData: UploadProductDto): Promise<PersistedProductEntity>;
  loadDetail(productId: number): Promise<PersistedProductEntity | null>;
  edit(
    productId: number,
    productData: EditProductDto,
  ): Promise<PersistedProductEntity>;
  delete(productId: number): Promise<void>;
  loadAllProducts(query: PaginationQuery): Promise<PersistedProductEntity[]>;
  loadUserProducts(
    userId: number,
    query: PaginationQuery,
  ): Promise<PersistedProductEntity[]>;
  createFavorite(productId: number, userId: number):Promise<Favorite>
  findFavorite(productId: number, userId: number):Promise<Favorite | null>
deleteFavorite(productId: number, userId: number):Promise<Favorite>
findFavoriteProductsByUserId(userId: number, query: PaginationQuery): Promise<FavoriteProductWithLike[]>
}