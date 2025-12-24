import { IUserService } from "../../inbound/port/services/user.service.interface";
import { SignUpDto, UpdateDto, UpdatePasswordDto, UserLikeListDto, UserProductsDto } from "../../inbound/requests/user/user.req.schemas";
import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { Sort, UserKeys } from "../../types/query";
import { PersistArticleEntity } from "../entity/article.entity";
import { PersistProductEntity } from "../entity/product/product.entity";
import { PersistUserEntity, UserEntity } from "../entity/user.entity";
import { IHashManager } from "../port/managers/hash.manager.interface";
import { IArticleRepo } from "../port/repo/article/article.repo.interface";
import { IProductRepo } from "../port/repo/product/product.repo.interface";
import { IUserRepo } from "../port/repo/user.repo.interface";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepo: IUserRepo,
    private readonly _productRepo: IProductRepo,
    private readonly _articleRepo: IArticleRepo,
    private readonly _hashManager: IHashManager
  ){}

  async signUpUser(dto: SignUpDto): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserByEmail(dto.email);

    if (foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_EXIST });
    }

    const newUser = await UserEntity.createNew({
      ...dto,
      hashManager: this._hashManager
    });
    
    const createdUser = await this._userRepo.create(newUser);
    return createdUser;
  };

  async getUser(id: string): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }
    return foundUser;
  };

  async getUserProducts(dto: UserProductsDto): Promise<PersistProductEntity[]> {
    const orderBy: { field: UserKeys, sort: Sort } =
      dto.sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : dto.sort === "email-asc"
          ? {
            field: "email",
            sort: "asc"
          }
          : {
            field: "email",
            sort: "desc"
          };

    if (dto.limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const productTotalCount = await this._productRepo.count();
    if (productTotalCount < dto.limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: productTotalCount });
    }

    const foundUser = await this._userRepo.findUserById(dto.id);

    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserProducts = await this._userRepo.findUserProducts(
      dto.id,
      dto.offset,
      dto.limit,
      orderBy,
    );
    if (!foundUserProducts) {
      throw new Exception({ info: EXCEPTIONS.USER_PRODUCTS_NOT_EXIST });
    }

    return foundUserProducts;
  };

  async getUserLikeProducts(dto: UserLikeListDto): Promise<PersistProductEntity[]> {
    if (dto.limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const foundUser = await this._userRepo.findUserById(dto.userId);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserLikeProducts = await this._productRepo.findUserLikeProducts(
      dto.userId,
      dto.offset,
      dto.limit,
    );
    if (!foundUserLikeProducts) {
      throw new Exception({ info: EXCEPTIONS.USER_LIKEPRODUCTS_NOT_EXIST });
    }

    return foundUserLikeProducts;
  };

  async getUserLikeArticles(dto: UserLikeListDto): Promise<PersistArticleEntity[]> {
    if (dto.limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const foundUser = await this._userRepo.findUserById(dto.userId);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserLikeArticles = await this._articleRepo.findUserLikeArticles(
      dto.userId,
      dto.offset,
      dto.limit,
    );
    if (!foundUserLikeArticles) {
      throw new Exception({ info: EXCEPTIONS.USER_LIKEARTICLES_NOT_EXIST });
    }

    return foundUserLikeArticles;
  };

  async updateUser(dto: UpdateDto): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserById(dto.id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    foundUser.update(dto);

    const updateUser = await this._userRepo.update(foundUser);

    return updateUser;
  };

  async updatePasswordUser(dto: UpdatePasswordDto): Promise<PersistUserEntity> {
    const foundUser = await this._userRepo.findUserById(dto.id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    if (!(await foundUser.isPasswordMatch(dto.password, this._hashManager))) {
      throw new Exception({ info: EXCEPTIONS.PASSWORD_MISMATCH });
    }

    await foundUser.updatePassword(dto.updatePassword, this._hashManager);

    return await this._userRepo.update(foundUser)
  };

  async deleteUser(id: string): Promise<void> {
    const foundUser = await this._userRepo.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    await this._userRepo.delete(id);
  };
}
