import { PrismaClient } from "@prisma/client";
import { BaseRepo } from "./base.repo";
import { ProductMapper } from "./mapper/product.mapper";
import { ProductKeys, QueryType } from "../types/query";
import { PersistedProductEntity, ProductEntity } from "../03-domain/entity/product/product.entity";
import { IProductRepo } from "../03-domain/port/repo/i.product.repo";


export type ProductListQueryType = QueryType<ProductKeys>

export type BaseProductParamsType = {
  userId: string;
  productId: string;
}
export type FindProductLikeParamsType = BaseProductParamsType;

export class ProductRepo extends BaseRepo implements IProductRepo {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  findProductByName = async (name: string) => {
    const product = await this._prisma.product.findUnique({
      where: {
        name,
      },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };

  findProductById = async (productId: string) => {
    const product = await this._prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product ? ProductMapper.toEntity(product) : null;
  };

  findProductLike = async (userId: string, productId: string) => {
    const product = await this._prisma.product.findUnique({
      where: {
        id: productId
      },
      include: {
        ProductLike: userId ? {
          where: {
            userId
          }
        } : false
      },
    });

    if (!product || product.ProductLike.length === 0) {
      return null; // 좋아요 없으면 null
    }

    return ProductMapper.toEntity(product);
  };

  findProductList = async <Tkey extends ProductKeys>({ offset, limit, orderBy }: ProductListQueryType) => {
    const productList = await this._prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort
      },
    });

    return productList.map((product) => ProductMapper.toEntity(product));
  };

  create = async (entity: PersistedProductEntity) => {
    const product = await this._prisma.product.create({
      data: {
        ...ProductMapper.toPersistentForCreate(entity),
      },
    });
    return ProductMapper.toEntity(product);
  };

  addProductLike = async (userId: string, productId: string) => {
    const createProductLike = await this._prisma.productLike.create({
      data: {
        userId,
        productId,
        isLiked: true,
      },
      include: {
        product: true,
      },
    });

    const productWithLike = {
      ...createProductLike.product,
      ProductLike: [createProductLike],
    }

    return ProductMapper.toEntity(productWithLike);
  };

  update = async (entity: ProductEntity) => {
    const updatedproduct = await this._prisma.product.update({
      where: { id: entity.id },
      data: {
        ...ProductMapper.toPersistent(entity),
        updatedAt: new Date(),
      },
    });

    return ProductMapper.toEntity(updatedproduct);
  };

  updateProductLike = async (userId: string, productId: string, isLiked: boolean) => {
    const updatedProductLike = await this._prisma.productLike.update({
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

    const productWithLike = {
      ...updatedProductLike.product,
      ProductLike: [updatedProductLike],
    }

    return ProductMapper.toEntity(productWithLike);
  };

  delete = async (productId: string) => {
    const deletedProduct = await this._prisma.product.delete({
      where: { id: productId },
    });
  };

  count = async () => {
    const totalCount = await this._prisma.product.count();

    return totalCount;
  };
}
