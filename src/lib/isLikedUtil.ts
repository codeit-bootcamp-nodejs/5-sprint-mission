import { prismaClient } from "./prismaClient";
import { ID, LikeableItem, LikeableItemWithLiked } from "../types/common";
import { LikeTarget } from "../types/models";

interface LikeWhereClause {
  userId: ID;
  articleId?: { in: ID[] };
  productId?: { in: ID[] };
}

interface LikeRecord {
  articleId?: ID;
  productId?: ID;
}

export async function attachIsLiked(
  items: LikeableItem[],
  userId: ID | null | undefined,
  type: LikeTarget
): Promise<LikeableItemWithLiked[]> {
  if (!userId) {
    return items.map((item) => ({ ...item, isLiked: false }));
  }

  let likeWhere: LikeWhereClause = { userId };
  if (type === "article") {
    likeWhere.articleId = { in: items.map((i) => i.id) };
  } else if (type === "product") {
    likeWhere.productId = { in: items.map((i) => i.id) };
  }

  const likes = await prismaClient.like.findMany({
    where: likeWhere,
    select: type === "article" ? { articleId: true } : { productId: true },
  });

  const likedIds = likes.map((like: LikeRecord) =>
    type === "article" ? like.articleId : like.productId
  );
  return items.map((item) => ({
    ...item,
    isLiked: likedIds.includes(item.id),
  }));
}
