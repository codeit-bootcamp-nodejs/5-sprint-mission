import { PersistProductEntity } from "../../../domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class UpdateProductResDto extends BaseProductResDto {
  constructor(updateProduct: PersistProductEntity) {
    super(updateProduct);
  }
}
