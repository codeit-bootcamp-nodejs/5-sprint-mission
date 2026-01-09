import { PersistProductEntity } from "../../../application/command/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class CreateProductResDto extends BaseProductResDto {
  constructor(createProduct: PersistProductEntity) {
    super(createProduct);
  }
}
