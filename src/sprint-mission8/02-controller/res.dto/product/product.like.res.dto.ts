import { PersistedProductEntity } from "../../../03-domain/entity/product/product.entity";
import { BaseProductResDto } from "./base.product.res.dto";

export class ProductLikeResDto extends BaseProductResDto{
  public ownerId;
  public isLiked;

  constructor(getProduct: PersistedProductEntity) {
    super(getProduct);
    this.ownerId = getProduct.userId;
    this.isLiked = getProduct.isLiked;
  }
}
