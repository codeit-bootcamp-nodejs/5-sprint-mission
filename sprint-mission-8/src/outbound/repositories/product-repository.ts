import { Prisma, PrismaClient, NotificationType } from "@prisma/client";
import { IProductRepository } from "../../domain/port/repository/product-repository";
import { BaseRepository } from "./base-repository";
import { PaginationQuery } from "../repository";
import {
  EditProductAttrs,
  NewProductAttrs,
  ProductEntity,
} from "../../domain/entity/proudct-entity";
import { createNotificationsTx } from "./notification-repository";
import { NotificationEntity } from "../../domain/entity/notification-entity";

export class ProductRepository
  extends BaseRepository
  implements IProductRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  upload = async (productData: NewProductAttrs & { userId: number }) => {
    const uploadedProduct = await this.prisma.product.create({
      data: productData,
    });

    return ProductEntity.fromPersisted(uploadedProduct);
  };

  loadDetail = async (productId: number) => {
    const productDetail = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!productDetail) {
      return null;
    }
    return ProductEntity.fromPersisted(productDetail);
  };

  edit = async (productId: number, productData: EditProductAttrs) => {
    const editedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: productData,
    });
    return ProductEntity.fromPersisted(editedProduct);
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
    return products.map(ProductEntity.fromPersisted);
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

    return products.map(ProductEntity.fromPersisted);
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

    return favorites.map((item) => ProductEntity.fromPersisted(item.product));
  };

  findFavoriteUserIdsByProductId = async (productId: number) => {
    const favorites = await this.prisma.favorite.findMany({
      where: { productId },
      select: { userId: true },
    });

    return favorites.map((f) => f.userId);
  };

  editWithNotifications = async (params: {
    productId: number;
    userId: number;
    data: EditProductAttrs;
    priceChange?: {
      oldPrice: number;
      newPrice: number;
      productName: string;
    } | null;
  }) => {
    const { productId, userId, data, priceChange } = params;

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { ...data, userId },
      });

      let notifications: NotificationEntity[] = [];
      if (priceChange) {
        const favorites = await tx.favorite.findMany({
          where: { productId },
          select: { userId: true },
        });

        const targets = Array.from(
          new Set(favorites.map((f) => f.userId).filter((id) => id !== userId)),
        );

        if (targets.length) {
          notifications = await createNotificationsTx(
            tx,
            targets.map((targetUserId) => ({
              userId: targetUserId,
              type: NotificationType.PRICE_CHANGE,
              title: "관심 상품의 가격이 변경되었습니다.",
              body: `${priceChange.productName} 가격이 ${priceChange.oldPrice} → ${priceChange.newPrice}로 변경되었습니다.`,
              url: `/product/${productId}`,
              data: {
                productId,
                oldPrice: priceChange.oldPrice,
                newPrice: priceChange.newPrice,
              },
            })),
          );
        }
      }

      return {
        product: ProductEntity.fromPersisted(updatedProduct),
        notifications,
      };
    });

    return result;
  };
}
