import { PersistedProductEntity } from "../../../domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class GetProductResDto extends BaseProductResDto{
  constructor(getProduct: PersistedProductEntity) {
    super(getProduct);
  }
}
