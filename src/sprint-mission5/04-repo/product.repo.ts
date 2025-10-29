import { PrismaClient } from "@prisma/client";
import { BaseRepo } from "./base.repo";
import { ProductMapper } from "./mapper/product.mapper";
import { QueryType } from "../types/query";
import { ProductEntity } from "../03-domain/entity/product.entity";
import { IProductRepo } from "../03-domain/port/repo/i.product.repo";

export type ProductKeys = "updatedAt" | "price";

export type ProductListQueryType<TKey> = QueryType<TKey> & {
  userId: string;
}

export type BaseProductParamsType = {
  userId: string;
  productId: string;
}
export type FindProductLikeParamsType = BaseProductParamsType;

export class ProductRepo extends BaseRepo implements IProductRepo{
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

  findProductLike = async (userId: string, productId: string)=> {
    const product = await this._prisma.product.findUnique({
      where: {
        id: productId
      },
      include: {
        ProductLike: userId ? {
          where:{
            userId
          }
        } : false
      },
    });
    
    return product ? ProductMapper.toEntity(product) : null;
  };

  findProductList = async <Tkey extends ProductKeys>({ userId, offset, limit, orderBy }: ProductListQueryType<Tkey>) => {
    const productList = await this._prisma.product.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field] : orderBy.sort
      },
    });

    return productList.map((product) => ProductMapper.toEntity(product));
  };

  create = async (entity: ProductEntity) => {
    const product = await this._prisma.product.create({
      data: {
        ...ProductMapper.toPersistent(entity),
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
      ArticleLike : [createProductLike],
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

  updateProductLike = async (userId: string, productId:string, isLiked: boolean) => {
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
      ArticleLike : [updatedProductLike],
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
