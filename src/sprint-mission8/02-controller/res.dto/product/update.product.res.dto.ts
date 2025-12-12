import { PersistedProductEntity } from "../../../03-domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class UpdateProductResDto extends BaseProductResDto{
  constructor(updateProduct: PersistedProductEntity){
    super(updateProduct);
  }
}
