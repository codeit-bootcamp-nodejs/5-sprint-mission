import { PersistProductEntity } from "../../../domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class GetProductResDto extends BaseProductResDto {
  constructor(getProduct: PersistProductEntity) {
    super(getProduct);
  }
}
