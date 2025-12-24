import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "@prisma/client";
import { NewUserEntity, PersistedUserEntity } from "../../../02-application/command/entity/user.entity";
import { IUserCommandRepository } from "../../../02-application/port/repositories/command/I.user.repository";
import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";
import { UserMapper } from "../../mapper/user.mapper";

export type PersistUser = Prisma.UserGetPayload<{}>;

export const createUserCommandRepository = (prisma: PrismaClient): IUserCommandRepository => {
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

    if (!user) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }

    return UserMapper.toPersist(user);
  };

  const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw BusinessException({
        type: BusinessExceptionType.DATA_NOT_FOUND
      })
    }

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

  const updateRefreshToken = async (
    email: string,
    refreshToken: string
  ): Promise<void> => {
    await prisma.user.update({
      where: { email },
      data: {
        refreshToken
      }
    })
  };


  return {
    save,
    findById,
    findByEmail,
    update,
    updateRefreshToken
  };
};
