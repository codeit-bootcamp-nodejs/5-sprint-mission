export class ProductService {
  #prisma;
  constructor(prisma) { this.#prisma = prisma; }

  async createProduct(userId, data) {
    return this.#prisma.product.create({
      data: { ...data, userId, images: { create: data.images.map(url => ({ url })) } },
      include: { images: true, likes: true }
    });
  }

  async getProducts(userId) {
    const items = await this.#prisma.product.findMany({
      include: { images: true, likes: true },
      orderBy: { createdAt: "desc" },
    });
    return items.map(p => ({
      ...p,
      thumbnail: p.images[0]?.url ?? null,
      isLiked: p.likes.some(l => l.userId === userId && l.isLiked),
    }));
  }

  async toggleLike(userId, productId) {
    const like = await this.#prisma.productLike.findUnique({ where: { userId_productId: { userId, productId } }});
    if (like) return this.#prisma.productLike.update({ where: { userId_productId: { userId, productId } }, data: { isLiked: !like.isLiked }});
    return this.#prisma.productLike.create({ data: { userId, productId }});
  }
}
