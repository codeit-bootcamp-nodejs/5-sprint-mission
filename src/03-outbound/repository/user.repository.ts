import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import { UserMapper } from "../mapper/user.mapper";
import { IUserRepository } from "../../02-domain/port/repositories/I.user.repository";
import {
  NewUserEntity,
  PersistedUserEntity,
} from "../../02-domain/entity/user.entity";

export type PersistUser = Prisma.UserGetPayload<{}>;

export const createUserRepository = (prisma: PrismaClient): IUserRepository => {
  const save = async (entity: NewUserEntity) => {
    const { email, nickname, password, refreshToken } = entity;
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        password,
        refreshToken,
      },
    });

    return UserMapper.toPersist(user);
  };

  const findById = async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return UserMapper.toPersist(user);
  };

  const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return UserMapper.toPersist(user);
  };

  const update = async (
    foundEntity: PersistedUserEntity,
    newEntity: NewUserEntity,
  ) => {
    const updatedUser = await prisma.user.update({
      where: { id: foundEntity.id },
      data: {
        email: newEntity.email,
        nickname: newEntity.nickname,
        password: newEntity.password,
        refreshToken: newEntity.refreshToken,
      },
    });
    return UserMapper.toPersist(updatedUser);
  };

  return {
    save,
    findById,
    findByEmail,
    update,
  };
};
