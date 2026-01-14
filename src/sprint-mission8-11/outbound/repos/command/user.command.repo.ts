import { PersistProductEntity } from "../../../application/command/entity/product/product.entity";
import { PersistUserEntity, NewUserEntity } from "../../../application/command/entity/user.entity";
import { IUserCommandRepo } from "../../../application/port/repo/command/user.command.repo.interface";
import { UserKeys, Sort } from "../../../types/query";
import { ProductMapper } from "../../mapper/product.mapper";
import { UserMapper } from "../../mapper/user.mapper";
import { BaseRepo } from "../base.repo";
import { productInclude } from "./product/product.command.repo";

export class UserCommandRepo extends BaseRepo implements IUserCommandRepo {
  async findUserByEmail(email: string): Promise<PersistUserEntity | null> {
    const user = await this._prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toPersistEntity(user) : null;
  }

  async findUserById(id: string): Promise<PersistUserEntity | null> {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toPersistEntity(user) : null;
  }

  async create(entity: NewUserEntity) {
    const newUser = await this._prisma.user.create({
      data: {
        ...UserMapper.toCreateData(entity),
      },
    });
    return UserMapper.toPersistEntity(newUser);
  }

  async update(entity: PersistUserEntity) {
    const updateUser = await this._prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        ...UserMapper.toUpdateData(entity),
      },
    });
    return UserMapper.toPersistEntity(updateUser);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
