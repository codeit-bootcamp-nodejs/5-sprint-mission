import { ProductKeys, Sort } from "../../../../types/query";
import { ProductView } from "../../../query/views/product.view";

export interface IProductQueryRepo {
  findProductList(
    offset: number,
    limit: number,
    orderBy: { field: ProductKeys; sort: Sort },
  ): Promise<ProductView[]>;

  findProductsByOwner(
    id: string,
    offset: number,
    limit: number,
    orderBy: { field: ProductKeys; sort: Sort },
  ): Promise<ProductView[] | null>;

  findProductsLikedByUser(
    userId: string,
    offset: number,
    limit: number,
  ): Promise<ProductView[] | null>;
}