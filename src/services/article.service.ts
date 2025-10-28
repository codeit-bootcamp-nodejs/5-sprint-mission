import { Prisma } from "@prisma/client";
import { articleRepository } from "../repositories/article.repository";

export const articleService = {
  mine: (userId: number) => articleRepository.findMine(userId),

  list: async (
    viewerId: number | undefined,
    q?: string,
    offset = 0,
    limit = 20,
    sort: "recent" | "asc" = "recent",
  ) => {
    const where: Prisma.ArticleWhereInput = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { content: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};
    const orderBy =
      sort === "recent" ? [{ createdAt: "desc" }] : [{ id: "asc" }];
    const [items, total] = await articleRepository.list(
      where,
      orderBy,
      offset,
      limit,
    );
    if (!viewerId) return { items, total };
    const ids = items.map((a) => a.id);
    const likes = await articleRepository.likesOfUserFor(viewerId, ids);
    const set = new Set(likes.map((l) => l.articleId));
    return {
      items: items.map((a) => ({ ...a, isLiked: set.has(a.id) })),
      total,
    };
  },

  get: async (id: number, viewerId?: number) => {
    const a = await articleRepository.findById(id);
    if (!a) {
      const e: any = new Error("게시글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    let isLiked = false;
    if (viewerId) {
      const likes = await articleRepository.likesOfUserFor(viewerId, [id]);
      isLiked = likes.length > 0;
    }
    return {
      id: a.id,
      title: a.title,
      content: a.content,
      createdAt: a.createdAt,
      isLiked,
    };
  },

  create: async (userId: number, data: any) => {
    const created = await articleRepository.create({ ...data, userId });
    return {
      id: created.id,
      title: created.title,
      content: created.content,
      createdAt: created.createdAt,
      isLiked: false,
    };
  },

  update: async (userId: number, id: number, data: any) => {
    const exists = await articleRepository.findById(id);
    if (!exists) {
      const e: any = new Error("게시글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("수정 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    const updated = await articleRepository.update(id, data);
    return {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      createdAt: updated.createdAt,
    };
  },

  remove: async (userId: number, id: number) => {
    const exists = await articleRepository.findById(id);
    if (!exists) {
      const e: any = new Error("게시글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    if (exists.userId !== userId) {
      const e: any = new Error("삭제 권한이 없습니다.");
      e.status = 403;
      throw e;
    }
    await articleRepository.delete(id);
  },

  like: async (userId: number, articleId: number) => {
    const exists = await articleRepository.findById(articleId);
    if (!exists) {
      const e: any = new Error("게시글을 찾을 수 없습니다.");
      e.status = 404;
      throw e;
    }
    await articleRepository.likeUpsert(userId, articleId);
    return { message: "좋아요 완료", isLiked: true };
  },

  unlike: async (userId: number, articleId: number) => {
    await articleRepository.likeDelete(userId, articleId);
    return { message: "좋아요 취소", isLiked: false };
  },
};
