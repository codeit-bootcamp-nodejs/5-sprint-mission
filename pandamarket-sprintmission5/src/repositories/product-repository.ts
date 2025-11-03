import { Prisma, PrismaClient } from "@prisma/client";
import { IProductRepository } from "../domain/port/product-repository-interface";
import { BaseRepository } from "./base-repository";
import { UploadProductDto } from "../dto/product/create-product.dto";
import { ProductMapper } from "./mapper/product-mapper";
import { EditProductDto } from "../dto/product/edit-product.dto";
import { PaginationQuery } from "./repository";
import { FavoriteProductWithLike } from "../domain/entity/proudct-entity";

export class ProductRepository extends BaseRepository implements IProductRepository{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  upload = async (productData: UploadProductDto) => {
    const uploadedProduct = await this.prisma.product.create({
      data: productData,
    });

    return ProductMapper.toEntity(uploadedProduct);
  };

  loadDetail = async (productId: number) => {
    const productDetail = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productDetail) {
      return null;
    }
    return ProductMapper.toEntity(productDetail);
  };

  edit = async (productId: number, productData: EditProductDto) => {
    const editedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: productData,
    });
    return ProductMapper.toEntity(editedProduct);
  };

  delete = async (productId: number) => {
    await this.prisma.product.delete({
      where: { id: productId },
    });
    return;
  };

  loadAllProducts = async (query: PaginationQuery) => {
    const { offset = 0, limit = 10, search = "" } = query;
    const condition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const products = await this.prisma.product.findMany({
      where: condition as Prisma.ProductWhereInput,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        tags: true,
        images: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: offset,
      take: limit,
    });
    return products.map(ProductMapper.toEntity);
  };

  loadUserProducts = async (userId: number, query: PaginationQuery) => {
    const { offset = 0, limit = 10 } = query;

    const products = await this.prisma.product.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        tags: true,
        images: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    return products.map(ProductMapper.toEntity);
  };

  createFavorite = async (productId: number, userId: number) => {
    return this.prisma.favorite.create({
      data: {
        productId: productId,
        userId: userId,
      },
    });
  };

  findFavorite = async (productId: number, userId: number) => {
    return this.prisma.favorite.findUnique({
      where: {
        productId_userId: {
          userId: userId,
          productId: productId,
        },
      },
    });
  };

  deleteFavorite = async (productId: number, userId: number) => {
    return this.prisma.favorite.delete({
      where: {
        productId_userId: {
          userId: userId,
          productId: productId,
        },
      },
    });
  };

  findFavoriteProductsByUserId = async (
    userId: number,
    query: PaginationQuery,
  ) => {
    const { offset = 0, limit = 10 } = query;

    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: userId,
      },
      select: {
        product: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    return favorites.map((item) => ({
      ...item.product,
      likedAt: item.createdAt,
    })) as FavoriteProductWithLike[]
  };
}
