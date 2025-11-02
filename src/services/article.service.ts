import { CreateArticleDTO, UpdateArticleDTO, WithIsLiked } from "@/types/dto";
import { articleRepository } from "../repositories/article.repository";

export const articleService = {
  async list(viewerId: number | null, opt: { offset: number; limit: number; sort: "recent" | "asc" }) {
    const orderBy = opt.sort === "asc" ? [{ createdAt: "asc" }] : [{ createdAt: "desc" }];
    const items = await articleRepository.list({}, orderBy, opt.offset, opt.limit);
    if (!viewerId) return items.map(a => ({ ...a, isLiked: false } as WithIsLiked<typeof a>));
    const liked = await articleRepository.likesOfUserFor(viewerId, items.map(i => i.id));
    const likedSet = new Set(liked.map(x => x.articleId));
    return items.map(a => ({ ...a, isLiked: likedSet.has(a.id) }));
  },

  async getById(viewerId: number | null, id: number) {
    const a = await articleRepository.findById(id);
    if (!a) throw Object.assign(new Error("게시글을 찾을 수 없습니다."), { status: 404 });
    if (!viewerId) return { ...a, isLiked: false };
    const liked = await articleRepository.likesOfUserFor(viewerId, [id]);
    return { ...a, isLiked: liked.some(x => x.articleId === id) };
  },

  async create(userId: number, dto: CreateArticleDTO) {
    const created = await articleRepository.create({ title: dto.title, content: dto.content, userId });
    return { ...created, isLiked: false };
  },

  async update(userId: number, id: number, dto: UpdateArticleDTO) {
    const exists = await articleRepository.findById(id);
    if (!exists) throw Object.assign(new Error("게시글을 찾을 수 없습니다."), { status: 404 });
    if (exists.userId !== userId) throw Object.assign(new Error("수정 권한이 없습니다."), { status: 403 });
    return articleRepository.update(id, dto);
  },

  async remove(userId: number, id: number) {
    const exists = await articleRepository.findById(id);
    if (!exists) throw Object.assign(new Error("게시글을 찾을 수 없습니다."), { status: 404 });
    if (exists.userId !== userId) throw Object.assign(new Error("삭제 권한이 없습니다."), { status: 403 });
    await articleRepository.delete(id);
  },

  async like(userId: number, id: number) {
    const exists = await articleRepository.findById(id);
    if (!exists) throw Object.assign(new Error("게시글을 찾을 수 없습니다."), { status: 404 });
    await articleRepository.likeUpsert(userId, id);
  },

  async unlike(userId: number, id: number) {
    await articleRepository.likeDelete(userId, id);
  },
};
