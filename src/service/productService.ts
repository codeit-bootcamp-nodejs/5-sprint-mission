import { PrismaClient } from "@prisma/client";
import { NotificationService } from "./notificationService";

export class ProductService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  // 상품 생성
  createProduct = async ({
    name,
    price,
    description,
    userId,
  }: {
    name: string;
    price: number;
    description?: string;
    userId: string;
  }) => {
    return this.prisma.product.create({
      data: {
        name,
        price,
        description: description ?? "",
        user: { connect: { id: userId } },
      },
    });
  };

  // 상품 목록 조회
  getProducts = async () => {
    return this.prisma.product.findMany();
  };

  // 좋아요 토글
  toggleLike = async (productId: string, userId: string) => {
    const existingLike = await this.prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } }, // 복합 키 맞춤
    });

    if (existingLike) {
      await this.prisma.productLike.delete({
        where: { userId_productId: { userId, productId } },
      });
      return { liked: false };
    } else {
      await this.prisma.productLike.create({
        data: {
          product: { connect: { id: productId } },
          user: { connect: { id: userId } },
        },
      });

      // 알림 전송
      await this.notificationService.createNotification(
        userId,
        "PRODUCT_PRICE_CHANGED",
        "좋아요한 상품이 있습니다.",
      );

      return { liked: true };
    }
  };
}