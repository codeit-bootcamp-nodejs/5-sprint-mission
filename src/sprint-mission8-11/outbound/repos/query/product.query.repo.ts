import { IProductQueryRepo } from "../../../application/port/repo/query/product.query.repo.interface";
import { ProductView } from "../../../application/query/views/product.view";
import { ProductKeys, Sort } from "../../../types/query";
import { BaseRepo } from "../base.repo"
import { productInclude } from "../command/product/product.command.repo";

export class ProductQueryRepo extends BaseRepo implements IProductQueryRepo {
  findProductList(offset: number, limit: number, orderBy: { field: ProductKeys; sort: Sort; }): Promise<ProductView[]> {
    throw new Error("Method not implemented.");
  }
  findProductsLikedByUser(userId: string, offset: number, limit: number): Promise<ProductView[] | null> {
    throw new Error("Method not implemented.");
  }
  async findProductsByOwner(
    id: string,
    offset: number,
    limit: number,
    orderBy: { field: ProductKeys; sort: Sort },
  ): Promise<ProductView[] | null> {
    const userProducts = await this._prisma.product.findMany({
      where: { userId: id },
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort,
      },
      include: productInclude,
    });

    return userProducts && userProducts.length > 0
      ?
      userProducts.map(product => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,

          productTags: product.tags.map(tag => {
            return {
              tagName: tag.tag.name
            }
          }),

          productImages: product.images.map(image => {
            return {
              url: image.url
            }
          }),

          writer: {
            ownerId: product.userId,
          }
        }
      })
      : null;
  }
}