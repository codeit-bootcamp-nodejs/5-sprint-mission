import { BaseRepo } from "./base.repo";
import { IUserRepo } from "../../domain/port/repo/user.repo.interface";
import { UserMapper } from "../mapper/user.mapper";
import { NewUserEntity, PersistUserEntity } from "../../domain/entity/user.entity";
import { ProductMapper } from "../mapper/product.mapper";
import { Sort, UserKeys } from "../../types/query";
import { PersistProductEntity } from "../../domain/entity/product/product.entity";
import { productInclude } from "./product/product.repo";

export class UserRepo extends BaseRepo implements IUserRepo {

  async findUserByEmail(email: string): Promise<PersistUserEntity | null> {
    const user = await this._prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toPersistEntity(user) : null;
  };

  async findUserById(id: string): Promise<PersistUserEntity | null> {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toPersistEntity(user) : null;
  };

  async findUserProducts(
    id: string,
    offset: number,
    limit: number,
    orderBy: { field: UserKeys, sort: Sort}
  ): Promise<PersistProductEntity[] | null> {
    const userProducts = await this._prisma.product.findMany({
      where: { userId: id },
      skip: offset,
      take: limit,
      orderBy: {
        [orderBy.field]: orderBy.sort
      },
      include: productInclude
    });
    return userProducts && userProducts.length > 0
      ? userProducts.map((userProduct) =>
        ProductMapper.toPersistEntity(userProduct)
      )
      : null;
  };

  async create(entity: NewUserEntity) {
    const newUser = await this._prisma.user.create({
      data: {
        ...UserMapper.toCreateData(entity),
      },
    });
    return UserMapper.toPersistEntity(newUser);
  };

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
  };

  async delete(id: string): Promise<void> {
    await this._prisma.user.delete({
      where: {
        id,
      },
    });
  };
}
