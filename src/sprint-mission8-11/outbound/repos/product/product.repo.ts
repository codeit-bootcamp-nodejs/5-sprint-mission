import { Prisma, PrismaClient } from "@prisma/client";
import { BaseRepo } from "../base.repo";
import { ProductMapper } from "../../mapper/product.mapper";
import {
  NewProductEntity,
  PersistProductEntity,
} from "../../../domain/entity/product/product.entity";
import { IProductRepo } from "../../../domain/port/repo/product/product.repo.interface";
import { ProductKeys, Sort } from "../../../types/query";

export const productInclude = Prisma.validator<Prisma.ProductInclude>()({
  images: { orderBy: { productId: "asc" } },
  tags: { include: { tag: true } },
});

export type PersistProduct = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export class ProductRepo extends BaseRepo implements IProductRepo {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }
  async findProductByName(name: string): Promise<PersistProductEntity | null> {
    const product = await this._prisma.product.findUnique({
      where: {
        name,
      },
      include: productInclude,
    });
    return product ? ProductMapper.toPersistEntity(product) : null;
  }

  async findProductById(
    productId: string,
  ): Promise<PersistProductEntity | null> {
    const product = await this._prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: productInclude,
    });
    return product ? ProductMapper.toPersistEntity(product) : null;
  }

  async findProductLike(
    userId: string,
    productId: string,
  ): Promise<PersistProductEntity | null> {
    const likeProduct = await this._prisma.product.findUnique({
      where: {
        id: productId,
        ProductLike: {
          some: {
            userId,
          },
        },
      },
      include: productInclude,
    });

    if (!likeProduct) {
      return null; // 좋아요 없으면 null
    }

    return ProductMapper.toPersistEntity(likeProduct);
  }

  async findProductList(
    offset: number,
    limit: number,
    orderBy: { field: ProductKeys; sort: Sort },
  ): Promise<PersistProductEntity[]> {
    const productList = await this._prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort,
      },
      include: productInclude,
    });

    return productList.map((product) => ProductMapper.toPersistEntity(product));
  }

  async findUserLikeProducts(
    userId: string,
    offset: number,
    limit: number,
  ): Promise<PersistProductEntity[] | null> {
    const userLikeProducts = await this._prisma.productLike.findMany({
      where: {
        userId,
      },
      skip: offset,
      take: limit,
      include: {
        product: {
          include: productInclude,
        },
      },
    });

    if (!userLikeProducts || userLikeProducts.length === 0) return null;

    return userLikeProducts.map((userLikeProduct) =>
      ProductMapper.toPersistEntity(userLikeProduct.product),
    );
  }

  async create(entity: NewProductEntity): Promise<PersistProductEntity> {
    const { productData, productImagesData, productTagsData } =
      ProductMapper.toCreateData(entity);

    const product = await this._prisma.product.create({
      data: {
        ...productData,
        images: { create: productImagesData },
        tags: { create: productTagsData },
      },
      include: productInclude,
    });

    return ProductMapper.toPersistEntity(product);
  }

  async update(entity: PersistProductEntity): Promise<PersistProductEntity> {
    const { productData, productImagesData, productTagsData } =
      ProductMapper.toUpdateData(entity);

    const updatedproduct = await this._prisma.product.update({
      where: { id: entity.id },
      data: {
        ...productData,
        updatedAt: new Date(),
        images: {
          deleteMany: {},
          create: productImagesData,
        },
        tags: {
          deleteMany: {},
          create: productTagsData,
        },
      },
      include: productInclude,
    });

    return ProductMapper.toPersistEntity(updatedproduct);
  }

  async delete(productId: string): Promise<void> {
    await this._prisma.product.delete({
      where: { id: productId },
    });
  }

  async count(): Promise<number> {
    const totalCount = await this._prisma.product.count();

    return totalCount;
  }
}
