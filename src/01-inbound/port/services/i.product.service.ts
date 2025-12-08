import { ProductReqDto, QueryType } from "../../request/req.validator"
import { ProductResDto } from "../../response/product.response"

export interface IProductService {
    likeProduct(id: string): Promise<ProductResDto>
    getAllProducts(query: QueryType): Promise<ProductResDto[]>
    getProduct(id: string): Promise<ProductResDto>
    createProduct(dto: ProductReqDto): Promise<ProductResDto>
    updateProduct(dto: ProductReqDto): Promise<ProductResDto>
    deleteProduct(id: string, userId: string): Promise<void>
}
