import { Prisma } from "@prisma/client";
import { CreateProductDTO, UpdateProductDTO, WithIsLiked } from "../types/dto";
import { productRepository } from "../repositories/product.repository";
import { notificationService } from "./notification.service";

export const productService = {
  async list(
    viewerId: number | null,
    opt: { offset: number; limit: number; sort: "recent" | "asc"; q?: string },
  ) {
    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      opt.sort === "asc" ? [{ createdAt: "asc" }] : [{ createdAt: "desc" }];

    const where: Prisma.ProductWhereInput = opt.q
      ? {
          OR: [
            { name: { contains: opt.q } },
            { description: { contains: opt.q } },
          ],
        }
      : {};

    const items = await productRepository.list(
      where,
      orderBy,
      opt.offset,
      opt.limit,
    );

    if (!viewerId) {
      return items.map(
        (p) => ({ ...p, isLiked: false }) as WithIsLiked<typeof p>,
      );
    }
    const liked = await productRepository.likesOfUserFor(
      viewerId,
      items.map((i) => i.id),
    );
    const likedSet = new Set(liked.map((x) => x.productId));
    return items.map((p) => ({ ...p, isLiked: likedSet.has(p.id) }));
  },

  async getById(viewerId: number | null, id: number) {
    const p = await productRepository.findById(id);
    if (!p)
      throw Object.assign(new Error("상품을 찾을 수 없습니다."), {
        status: 404,
      });

    if (!viewerId) return { ...p, isLiked: false };
    const liked = await productRepository.likesOfUserFor(viewerId, [id]);
    return { ...p, isLiked: liked.some((x) => x.productId === id) };
  },

  async mine(userId: number) {
    return productRepository.findMine(userId);
  },

  async create(userId: number, dto: CreateProductDTO) {
    return productRepository.create({ ...dto, userId });
  },

  async update(userId: number, id: number, dto: UpdateProductDTO) {
    const exists = await productRepository.findById(id);
    if (!exists)
      throw Object.assign(new Error("상품을 찾을 수 없습니다."), {
        status: 404,
      });
    if (exists.userId !== userId)
      throw Object.assign(new Error("수정 권한이 없습니다."), { status: 403 });

    // 1. 가격 변경 여부 체크
    const priceChanged = dto.price !== undefined && dto.price !== exists.price;

    // 2. 업데이트
    const updated = await productRepository.update(id, dto);

    // 3. 좋아요 누른 유저에게 알림
    if (priceChanged) {
      const likedUsers = await productRepository.findLikedUsers(id);

      for (const { userId } of likedUsers) {
        await notificationService.send(
          userId,
          "PRODUCT_PRICE",
          "좋아요한 상품의 가격이 변경되었습니다",
        );
      }
    }

    return updated;
  },

  async remove(userId: number, id: number) {
    const exists = await productRepository.findById(id);
    if (!exists)
      throw Object.assign(new Error("상품을 찾을 수 없습니다."), {
        status: 404,
      });
    if (exists.userId !== userId)
      throw Object.assign(new Error("삭제 권한이 없습니다."), { status: 403 });

    await productRepository.delete(id);
  },

  async like(userId: number, id: number) {
    const exists = await productRepository.findById(id);
    if (!exists)
      throw Object.assign(new Error("상품을 찾을 수 없습니다."), {
        status: 404,
      });
    await productRepository.likeUpsert(userId, id);
  },

  async unlike(userId: number, id: number) {
    await productRepository.likeDelete(userId, id);
  },
};

export class ProductService {
  create(name: string) {
    return { id: 1, name };
  }
}
