import { ProductMapper } from "./mapper/product.mapper.js";
import { UserMapper } from "./mapper/user.mapper.js";

export class UserRepo {
  #prisma;

  constructor(prisma) {
    this.#prisma = prisma;
  }

  findUserByEmail = async (email) => {
    const user = await this.#prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toEntity(user) : null;
  };
  findUserById = async (id) => {
    const user = await this.#prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toEntity(user) : null;
  };
  findUserByRefreshToken = async (refreshToken) => {
    const user = await this.#prisma.user.findUnique({
      where: { refreshToken },
    });
    return user ? UserMapper.toEntity(user) : null;
  }
  findUserProducts = async (id) => {
    const userProducts = await this.#prisma.product.findMany({
      where: { userId: id },
    });
    return userProducts && userProducts.length > 0 ? userProducts.map((userProduct) => ProductMapper.toEntity(userProduct)) : null;
  }
  create = async (entity) => {
    const newUser = await this.#prisma.user.create({
      data: {
        ...UserMapper.toPersistent(entity),
      }
    });
    return UserMapper.toEntity(newUser);
  };

  update = async (entity) => {
    const updateUser = await this.#prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        ...UserMapper.toPersistent(entity),
      }
    });
    return UserMapper.toEntity(updateUser);
  };

  updatePassword = async (entity) => {
    const updateUser = await this.#prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        ...UserMapper.toPersistent(entity),
      }
    });
    return UserMapper.toEntity(updateUser);
  };

  delete = async (id) => {
    const deleteUser = await this.#prisma.user.delete({
      where: {
        id
      },
    });
    return deleteUser;
  };

  generate = async (userId, refreshToken) => {
    const user = await this.#prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken
      }
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  refreshTokenDelete = async (id, refreshToken) => {
    const user = await this.#prisma.user.update({
      where: { id },
      data: {
        refreshToken,
      },
    });
  };
}