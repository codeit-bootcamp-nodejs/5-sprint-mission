import { BaseRepo } from "./base.repo.js";
import { ProductMapper } from "./mapper/product.mapper.js";

export class ProductRepo extends BaseRepo {
  constructor(prisma) {
    super(prisma);
  }
  findProductByName = async (name) => {
    const product = await this.prisma.product.findUnique({
      where: {
        name,
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

  findProductLike = async (userId, productId) => {
    const product = await this.prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: {
        product: true,
      },
    });
    return product ? ProductMapper.toEntityLike(product) : null;
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

  addProductLike = async (userId, productId) => {
    const createProductLike = await this.prisma.productLike.create({
      data: {
        userId,
        productId,
        isLiked: true,
      },
      include: {
        product: true,
      },
    });

    return ProductMapper.toEntityLike(createProductLike);
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

  updateProductLike = async (userId, productId, isLiked) => {
    const updatedProductLike = await this.prisma.productLike.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        isLiked,
      },
      include: {
        product: true,
      },
    });

    return ProductMapper.toEntityLike(updatedProductLike);
  };

  delete = async (productId) => {
    const deletedProduct = await this.prisma.product.delete({
      where: { id: productId },
    });
    return deletedProduct;
  };

  cancelProductLike = async (userId, productId, isLiked) => {
    const cancelProductLike = await this.prisma.productLike.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        isLiked,
      },
      include: {
        product: true,
      },
    });

    return ProductMapper.toEntityLike(cancelProductLike);
  };

  count = async () => {
    const totalCount = await this.prisma.product.count();

    return totalCount;
  };
}
