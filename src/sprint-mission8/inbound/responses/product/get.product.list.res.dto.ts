import { PersistedProductEntity } from "../../../domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class GetProductListResDto {
  public products: BaseProductResDto[];

  constructor(productList: PersistedProductEntity[]) {
    this.products = productList.map((product) => (
      new BaseProductResDto(product)
    ));
  }
}
