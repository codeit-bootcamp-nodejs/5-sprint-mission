import { PersistedProductEntity } from "../../../03-domain/entity/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class GetProductResDto extends BaseProductResDto{
  constructor(getProduct: PersistedProductEntity) {
    super(getProduct);
  }
}
