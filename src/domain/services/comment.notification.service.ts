import { prismaClient } from "../../common/lib/prisma.client";
import { sendNotificationToUser } from "../../common/lib/socket.manager";

export async function notifyCommentOnArticle(
  articleId: number,
  commenterId: number,
  commentContent: string,
) {
  const article = await prismaClient.article.findUnique({
    where: { id: articleId },
    include: {
      user: {
        select: { id: true, nickname: true },
      },
    },
  });

  if (!article) {
    throw new Error("게시글을 찾을 수 없습니다");
  }

  if (article.user.id === commenterId) {
    return;
  }

  const message = `"${article.title}" 게시글에 새로운 댓글이 달렸습니다.`;

  await sendNotificationToUser(article.user.id, {
    type: "ARTICLE_COMMENT",
    message,
    actorId: commenterId,
    articleId,
  });
}

export async function notifyCommentOnProduct(
  productId: number,
  commenterId: number,
  productName: string,
) {
  const product = await prismaClient.product.findUnique({
    where: { id: productId },
    include: {
      user: {
        select: { id: true, nickname: true },
      },
    },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다");
  }

  if (product.user.id === commenterId) {
    return;
  }

  const message = `"${product.name}" 상품에 새로운 댓글이 달렸습니다.`;

  await sendNotificationToUser(product.user.id, {
    type: "PRODUCT_COMMENT",
    message,
    actorId: commenterId,
    productId,
  });
}

export async function getCommentNotifications(
  articleId?: number,
  productId?: number,
  limit: number = 10,
) {
  const where: any = {};

  if (articleId) {
    where.articleId = articleId;
    where.type = "ARTICLE_COMMENT";
  } else if (productId) {
    where.productId = productId;
    where.type = "PRODUCT_COMMENT";
  }

  const notifications = await prismaClient.notification.findMany({
    where,
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
