import { ProductRequest, QueryType } from "../../../01-inbound/request/req.validator";
import { Product } from "../../entity/product";

export interface IProductRepository {
    save(dto: ProductRequest): Promise<Product>;
    findById(id: string): Promise<Product>;
    likeById(id: string, like: boolean): Promise<Product>;
    findAll(query: QueryType): Promise<Product[]>;
    updateById(dto: ProductRequest): Promise<Product>
    deleteById(id: string): void;
    findByUserId(userId: string): Promise<Product[]>
}
