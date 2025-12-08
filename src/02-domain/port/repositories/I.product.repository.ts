import { ProductReqDto, QueryType } from "../../../01-inbound/request/req.validator";
import { NewProduct, PersistedProduct } from "../../entity/product";

export interface IProductRepository {
    save(entity: NewProduct): Promise<PersistedProduct>;
    findById(id: string): Promise<PersistedProduct>;
    likeById(id: string, like: boolean): Promise<PersistedProduct>;
    findAll(query: QueryType): Promise<PersistedProduct[]>;
    updateById(entity: PersistedProduct): Promise<PersistedProduct>
    deleteById(id: string): void;
    findByUserId(userId: string): Promise<PersistedProduct[]>
}
