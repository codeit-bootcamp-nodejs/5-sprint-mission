import { PersistProductEntity } from "../../../../domain/entity/product/product.entity";
import { CreateProductDto, DeleteProductDto, GetLikedProductsDto, GetProductDto, GetProductListDto, UpdateProductDto } from "../../../requests/product/product.req.schemas";

export interface IProductService {
  getProduct(dto: GetProductDto): Promise<PersistProductEntity>;
  getProductList(dto: GetProductListDto): Promise<PersistProductEntity[]>;
  likeProduct(dto: GetLikedProductsDto): Promise<void>;
  unlikeProduct(dto: GetLikedProductsDto): Promise<void>;
  createProduct(dto: CreateProductDto): Promise<PersistProductEntity>;
  updateProduct(dto: UpdateProductDto): Promise<PersistProductEntity>;
  deleteProduct(dto: DeleteProductDto): Promise<void>
}