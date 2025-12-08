import { ProductRequest, QueryType } from "../../request/req.validator"
import { ProductResDto } from "../../response/product.res.dto"

export interface IProductService {
    likeProduct(id: string): Promise<ProductResDto>
    getAllProducts(query: QueryType): Promise<ProductResDto[]>
    getProduct(id: string): Promise<ProductResDto>
    createProduct(dto: ProductRequest): Promise<ProductResDto>
    updateProduct(dto: ProductRequest): Promise<ProductResDto>
    deleteProduct(id: string): Promise<void>
}
