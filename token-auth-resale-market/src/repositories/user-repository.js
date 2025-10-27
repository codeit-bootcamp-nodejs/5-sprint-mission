import { BaseRepository } from "./base-repository.js";

export class UserRepository extends BaseRepository {
  constructor(prisma) {
    super(prisma, prisma.user);
  }

  create = async ({ email, password, nickname }) => {
    const newUser = await this.model.create({
      data: {
        email,
        password,
        nickname,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  };

  findUserByEmail = async (email) => {
    const user = await this.model.findUnique({
      where: { email },
    });
    return user;
  };

  findById = async (userId) => {
    const user = await this.model.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  };

  update = async (userId, updateData) => {
    const updatedUser = await this.model.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedUser;
  };

  updatePassword = async (userId, newHashedPassword) => {
    const user = await this.model.update({
      where: { id: userId },
      data: { password: newHashedPassword },
      select: {
        id: true,
        email: true,
        nickname: true,
        image: true,
        updatedAt: true,
      },
    });
    return user;
  };

  findUserByRefreshToken = async (refreshToken) => {
    const user = await this.model.findFirst({
      where: { refreshToken },
    });
    return user;
  };

  updateRefreshToken = async (userId, refreshToken) => {
    const user = await this.model.update({
      where: { id: userId },
      data: { refreshToken },
    });
    return user;
  };

  findUserProducts = async (userId, query = {}) => {
    const { offset = 0, limit = 10 } = query;

    const products = await this.prisma.product.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    return products;
  };

  findLikedProducts = async (userId, query = {}) => {
    const { offset = 0, limit = 10 } = query;

    const likedProducts = await this.prisma.productLike.findMany({
      where: { userId },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
            images: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });
    return likedProducts.map((item) => ({
      ...item.product,
      likedAt: item.createdAt,
    }));
  };

  findLikedArticles = async (userId, query = {}) => {
    const { offset = 0, limit = 10 } = query;

    const likedArticles = await this.prisma.articleLike.findMany({
      where: { userId },
      select: {
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    return likedArticles.map((item) => ({
      ...item.article,
      likedAt: item.createdAt,
    }));
  };
}
