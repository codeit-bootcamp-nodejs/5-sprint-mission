import prisma from "../generated/prisma/index.js";

export class ProductService {

  create = async ({ name, description, price, tags }) => {
    return prisma.product.create({
      data: { name, description, price, tags },
    });
  };

  getById = async (id) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    if (!product) throw new Error("상품을 찾을 수 없습니다.");
    return product;
  };

  update = async (id, data) => {
    return prisma.product.update({
      where: { id: Number(id) },
      data,
    });
  };

  delete = async (id) => {
    return prisma.product.delete({
      where: { id: Number(id) },
    });
  };

  list = async ({ skip, take, search, sort }) => {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderBy = sort === "recent" ? { createdAt: "desc" } : {};

    const items = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    });

    const total = await prisma.product.count({ where });

    return { total, items };
  };
}
