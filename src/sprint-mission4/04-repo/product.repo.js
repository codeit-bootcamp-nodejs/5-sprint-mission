import { BaseRepo } from "./base.repo.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class ProductRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }
  findProductByName = async (name) => {
    const product = await this.prisma.product.findUnique({
      where: {
        name
      },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };

  findProductById = async (productId) => {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };
  findProductList = async ({ userId, offset, limit, orderBy }) => {
    const productList = await this.prisma.product.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: [orderBy],
    });

    return productList.map((product) => ProductMapper.toEntity(product));
  };

  create = async (entity) => {
    const product = await this.prisma.product.create({
      data: {
        ...ProductMapper.toPersistent(entity),
      },
    });
    return ProductMapper.toEntity(product);
  };

  update = async (entity) => {
    const updatedproduct = await this.prisma.product.update({
      where: { id: entity.id },
      data: {
        ...ProductMapper.toPersistent(entity),
        updatedAt: new Date(),
      },
    });

    return ProductMapper.toEntity(updatedproduct);
  };

  delete = async (productId) => {
    const deletedProduct = await this.prisma.product.delete({
      where: { id: productId },
    });
    return deletedProduct;
  };

  count = async () => {
    const totalCount = await this.prisma.product.count();

    return totalCount;
  };
}
