import { Prisma } from "@prisma/client";
import { productRepository } from "../repositories/product.repository";

export const productService = {
  mine: (userId: number) => productRepository.findMine(userId),

  list: async (
    viewerId: number | undefined,
    q?: string,
    offset = 0,
    limit = 20,
    sort: "recent" | "asc" = "recent",
  ) => {
    const where: Prisma.ProductWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy =
      sort === "recent" ? [{ createdAt: "desc" }] : [{ id: "asc" }];
    const [items, total] = await productRepository.list(
      where,
      orderBy,
      offset,
      limit,
    );
    if (!viewerId) return { items, total };
    const ids = items.map((x) => x.id);
    const likes = await productRepository.likesOfUserFor(viewerId, ids);
    const set = new Set(likes.map((l) => l.productId));
    return {
      items: items.map((p) => ({ ...p, isLiked: set.has(p.id) })),
      total,
    };
  },

  get: async (id: number, viewerId?: number) => {
    const p = await productRepository.findById(id);
    if (!p) {
      const e: any = new Error("상품을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    let isLiked = false;
    if (viewerId) {
      const likes = await productRepository.likesOfUserFor(viewerId, [id]);
      isLiked = likes.length > 0;
    }
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      tags: p.tags,
      createdAt: p.createdAt,
      isLiked,
    };
  },

  create: async (userId: number, data: any) => {
    const created = await productRepository.create({ ...data, userId });
    return {
      id: created.id,
      name: created.name,
      description: created.description,
      price: created.price,
      tags: created.tags,
      createdAt: created.createdAt,
      isLiked: false,
    };
  },

  update: async (userId: number, id: number, data: any) => {
    const exists = await productRepository.findById(id);
    if (!exists) {
      const e: any = new Error("상품을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("수정 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    const updated = await productRepository.update(id, data);
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      price: updated.price,
      tags: updated.tags,
      createdAt: updated.createdAt,
    };
  },

  remove: async (userId: number, id: number) => {
    const exists = await productRepository.findById(id);
    if (!exists) {
      const e: any = new Error("상품을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("삭제 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    await productRepository.delete(id);
  },

  like: async (userId: number, productId: number) => {
    const exists = await productRepository.findById(productId);
    if (!exists) {
      const e: any = new Error("상품을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    await productRepository.likeUpsert(userId, productId);
    return { message: "좋아요 완료", isLiked: true };
  },

  unlike: async (userId: number, productId: number) => {
    await productRepository.likeDelete(userId, productId);
    return { message: "좋아요 취소", isLiked: false };
  },
};
