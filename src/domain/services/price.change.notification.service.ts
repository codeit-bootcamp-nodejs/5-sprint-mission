import { prismaClient } from "../../common/lib/prisma.client";
import { sendNotificationToUser } from "../../common/lib/socket.manager";

interface PriceChangeNotificationData {
  productId: number;
  productName: string;
  oldPrice: number;
  newPrice: number;
  priceDifference: number;
  priceChangePercentage: number;
}

export async function notifyPriceChange(
  productId: number,
  userId: number,
  oldPrice: number,
  newPrice: number,
) {
  if (oldPrice === newPrice) {
    return;
  }

  const priceDifference = newPrice - oldPrice;
  const priceChangePercentage = Math.round((priceDifference / oldPrice) * 100);

  const product = await prismaClient.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다");
  }

  const likes = await prismaClient.like.findMany({
    where: { productId },
  });

  if (likes.length === 0) {
    return;
  }

  const notificationData: PriceChangeNotificationData = {
    productId,
    productName: product.name,
    oldPrice,
    newPrice,
    priceDifference,
    priceChangePercentage,
  };

  const recipientUserIds = likes.map((like: any) => like.userId);

  for (const recipientUserId of recipientUserIds) {
    const message =
      priceDifference > 0
        ? `좋아요한 상품 "${product.name}"의 가격이 ${Math.abs(priceDifference).toLocaleString()}원 올랐습니다. (${Math.abs(priceChangePercentage)}%)`
        : `좋아요한 상품 "${product.name}"의 가격이 ${Math.abs(priceDifference).toLocaleString()}원 내렸습니다. (${Math.abs(priceChangePercentage)}%)`;

    await sendNotificationToUser(recipientUserId, {
      type: "PRICE_CHANGE",
      message,
      actorId: userId,
      productId,
    });
  }

  return notificationData;
}

export async function getPriceChangeHistory(
  productId: number,
  limit: number = 10,
) {
  const notifications = await prismaClient.notification.findMany({
    where: {
      productId,
      type: "PRICE_CHANGE",
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      actor: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  });

  return notifications;
}
