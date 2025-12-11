import { ProductReqDto, QueryType } from "../../../01-inbound/request/req.validator";
import { NewProduct, PersistedProduct } from "../../entity/product";

export interface IProductRepository {
    save(entity: NewProduct): Promise<PersistedProduct>;
    findById(id: string): Promise<PersistedProduct>;
    like(entity: PersistedProduct): Promise<PersistedProduct>;
    findAll(query: QueryType): Promise<PersistedProduct[]>;
    update(foundEntity: PersistedProduct, newEntity: NewProduct): Promise<PersistedProduct>
    deleteById(id: string): void;
    findByUserId(userId: string): Promise<PersistedProduct[]>
}
