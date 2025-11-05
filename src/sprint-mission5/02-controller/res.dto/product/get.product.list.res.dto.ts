import { PersistedProductEntity } from "../../../03-domain/entity/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class GetProductListResDto {
  public products: BaseProductResDto[];

  constructor(productList: PersistedProductEntity[]) {
    this.products = productList.map((product) => (
      new BaseProductResDto(product)
    ));
  }
}
