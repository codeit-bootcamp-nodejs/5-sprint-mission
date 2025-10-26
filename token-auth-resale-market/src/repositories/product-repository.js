import { BaseRepository } from "./base-repository";

export class ProductRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma, prisma.product);
  }

  post = async (productData) => {
    const postedProduct = await this.model.create({
      data: productData,
    });
    return postedProduct;
  };
  loadDetail = async (productId) => {
    const productDetail = await this.model.findUnique({
      where: { id: productId },
    });
    return productDetail;
  };
  edit = async (productId, productData) => {
    const editedProduct = await this.model.update({
      where: { id: productId },
      data: productData,
    });
    return editedProduct;
  };
  delete = async (productId) => {
    const deletedProduct = await this.model.delete({
      where: { id: productId },
    });
    return deletedProduct;
  };
  load = async (query) => {
    const { offset = 0, limit = 10, search = "" } = query;
    const condition = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const products = await this.model.findMany({
      where: condition,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    return products;
  };
}
