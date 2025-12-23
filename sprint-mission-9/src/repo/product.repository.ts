import prisma from "../prisma.client";
import { Prisma } from "@prisma/client";
import { CreateProductDto, UpdateProductDto, ProductListQueryDto } from "../dto/product.dto";

export class ProductRepository {
  async createProduct(authorId: number, data: CreateProductDto) {
    return prisma.product.create({
      data: {
        authorId,
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
      },
    });
  }

  async findProducts(query: ProductListQueryDto, userId?: number) {
    const { offset, limit, keyword, sort } = query;

    const queryMode: Prisma.QueryMode = "insensitive";

    const whereCondition: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: keyword, mode: queryMode } },
        { description: { contains: keyword, mode: queryMode } },
      ],
    };

    return prisma.product.findMany({
      skip: offset,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: sort === "recent" ? "desc" : "asc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        author: {
          select: { nickname: true },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });
  }

  async findProductById(id: number, userId?: number) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: { nickname: true },
        },
        _count: {
          select: { likes: true },
        },
        likes: userId
          ? {
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });
  }

  async findProductByIdSimple(id: number) {
    return prisma.product.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });
  }

  async updateProduct(id: number, data: UpdateProductDto) {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        tags: data.tags,
      },
    });
  }

  async deleteProduct(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async findProductLike(userId: number, productId: number) {
    return prisma.productLike.findUnique({
      where: {
        productId_userId: {
          userId: userId,
          productId: productId,
        },
      },
    });
  }

  async createProductLike(userId: number, productId: number) {
    return prisma.productLike.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });
  }

  async deleteProductLike(id: number) {
    return prisma.productLike.delete({
      where: { id },
    });
  }

  async countProductLikes(productId: number) {
    return prisma.productLike.count({
      where: { productId },
    });
  }

  async findUsersByLikedProduct(productId: number) {
    return prisma.user.findMany({
      where: {
        productLikes: {
          some: {
            productId: productId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }
}
