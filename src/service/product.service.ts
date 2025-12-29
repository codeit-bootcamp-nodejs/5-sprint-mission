import { ProductRepository } from "../repo/product.repository";
import { NotificationService } from "./notification.service";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductListQueryDto,
} from "../dto/product.dto";
import { HttpError } from "../middlewares/error.handler";
import { Prisma } from "@prisma/client";

export class ProductService {
  private productRepository;
  private notificationService;

  constructor(
    productRepository: ProductRepository,
    notificationService: NotificationService,
  ) {
    this.productRepository = productRepository;
    this.notificationService = notificationService;
  }

  async createProduct(authorId: number, data: CreateProductDto) {
    return this.productRepository.createProduct(authorId, data);
  }

  async getProducts(query: ProductListQueryDto, userId?: number) {
    const products = await this.productRepository.findProducts(query, userId);

    return products.map((product) => {
      const { _count, likes, author, ...rest } = product;
      const likeCount = _count?.likes ?? 0;
      const isLiked = Array.isArray(likes) ? likes.length > 0 : false;
      const authorNickname = author?.nickname;

      return {
        ...rest,
        likeCount,
        isLiked,
        authorNickname,
      };
    });
  }

  async getProductById(id: number, userId?: number) {
    const product = await this.productRepository.findProductById(id, userId);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }

    const { _count, likes, author, ...rest } = product;
    const likeCount = _count?.likes ?? 0;
    const isLiked = Array.isArray(likes) ? likes.length > 0 : false;
    const authorNickname = author?.nickname;

    return {
      ...rest,
      likeCount,
      isLiked,
      authorNickname,
    };
  }

  async updateProduct(id: number, userId: number, data: UpdateProductDto) {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }
    if (product.authorId !== userId) {
      throw new HttpError(403, "상품을 수정할 권한이 없습니다.");
    }

    const updatedProduct = await this.productRepository.updateProduct(id, data);
    if (product.price !== updatedProduct.price) {
      const likedUsers =
        await this.productRepository.findUsersByLikedProduct(id);

      const message = `좋아요한 상품 '${updatedProduct.name}'의 가격이 변경되었습니다.`;

      await Promise.all(
        likedUsers.map((user) =>
          this.notificationService.createNotification(
            user.id,
            message,
            "PRODUCT_PRICE_UPDATE",
            id,
            undefined,
          ),
        ),
      );
    }

    return updatedProduct;
  }

  async deleteProduct(id: number, userId: number) {
    const product = await this.productRepository.findProductByIdSimple(id);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }
    if (product.authorId !== userId) {
      throw new HttpError(403, "상품을 삭제할 권한이 없습니다.");
    }

    try {
      await this.productRepository.deleteProduct(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new HttpError(404, "상품을 찾을 수 없습니다.");
        }
      }
      throw error;
    }
  }

  async toggleProductLike(productId: number, userId: number) {
    const product =
      await this.productRepository.findProductByIdSimple(productId);
    if (!product) {
      throw new HttpError(404, "상품을 찾을 수 없습니다.");
    }

    const existingLike = await this.productRepository.findProductLike(
      userId,
      productId,
    );

    let isLiked: boolean;
    if (existingLike) {
      await this.productRepository.deleteProductLike(existingLike.id);
      isLiked = false;
    } else {
      await this.productRepository.createProductLike(userId, productId);
      isLiked = true;
    }

    const likeCount = await this.productRepository.countProductLikes(productId);

    return {
      productId,
      userId,
      isLiked,
      likeCount,
    };
  }
}
