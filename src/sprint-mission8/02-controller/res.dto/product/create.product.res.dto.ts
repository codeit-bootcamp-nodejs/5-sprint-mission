import { PersistedProductEntity, ProductEntity } from "../../../domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class CreateProductResDto extends BaseProductResDto{
  constructor(createProduct: PersistedProductEntity) {
    super(createProduct);
  }
}
