import { prismaClient } from './prismaClient.js';

export async function attachIsLiked(items, userId, type) {
  if (!userId) {
    return items.map((item) => ({ ...item, isLiked: false }));
  }
  let likeWhere = { userId };
  if (type === 'article') {
    likeWhere.articleId = { in: items.map((i) => i.id) };
  } else if (type === 'product') {
    likeWhere.productId = { in: items.map((i) => i.id) };
  }
  const likes = await prismaClient.like.findMany({
    where: likeWhere,
    select: type === 'article' ? { articleId: true } : { productId: true },
  });
  const likedIds = likes.map((like) => (type === 'article' ? like.articleId : like.productId));
  return items.map((item) => ({ ...item, isLiked: likedIds.includes(item.id) }));
}
