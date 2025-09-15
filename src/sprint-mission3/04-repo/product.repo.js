import { BaseRepo } from "./base.repo.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class ProductRepo extends BaseRepo{
  #includesOptions;
  constructor(prisma) {
    super(prisma);
    // this.#includesOptions = {
    //   : true,
    // };
  }

  findProductByname = async (name) => {
    const product = await this.prisma.product.findUnique({
      where: { name },
    });
    return product ? ProductMapper.toEntity(product) : null;
  }

  findProductById = async (id) => {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductMapper.toEntity(product) : null;
  }
  findProductList = async ({ offset, limit, orderBy }) => {
    const productList = await this.prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: [orderBy],
    });

    return productList.map(product => ProductMapper.toEntity(product));
  }

  create = async (entity) => {
    const product = await this.prisma.product.create({
      data: {
        ...ProductMapper.toPersistent(entity),
      }
    });
    return ProductMapper.toEntity(product);
  };

  update = async (entity) => {
    const updatedproduct = await this.prisma.product.update({
      where: { id: entity.id },
      data: {
        ...ProductMapper.toPersistent(entity),
        updatedAt: new Date(),
      }
    });

    return ProductMapper.toEntity(updatedproduct);
  }

  delete = async (entity) => {
    const deletedProduct = await this.prisma.product.delete({
      where: entity.id
        ? { id: entity.id }
        : { name: entity.name }
    });
    return deletedProduct;
  }

  count = async () => {
    const totalCount = await this.prisma.product.count();

    return totalCount;
  }
}