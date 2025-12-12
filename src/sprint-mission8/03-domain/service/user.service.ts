import { IRepos } from "../../04-repo/repos";
import { EXCEPTIONS } from "../../common/const/exception.info";
import { Exception } from "../../common/exception/exception";
import { IManagers } from "../../common/util/managers";
import { BaseQueryType, Sort, UserKeys, UserSort } from "../../types/query";
import { ArticleEntity } from "../entity/article.entity";
import { ProductEntity } from "../entity/product/product.entity";
import { PersistedUserEntity, UserEntity } from "../entity/user.entity";
import { BaseService } from "./base.service";

export interface IUserService {
  signUpUser: ({ email, nickname, image, password }: SignUpUserParams) => Promise<PersistedUserEntity>;
  getUser: ({ id }: GetUserParams) => Promise<PersistedUserEntity>;
  getUserProducts: ({ id, offset, limit, sort }: BaseUserQueryType) => Promise<{
    user: PersistedUserEntity;
    products: ProductEntity[];
  }>;
  getUserLikeProducts: ({ id, offset, limit }: BaseLikeQueryType) => Promise<ProductEntity[]>;
  getUserLikeArticles: ({ id, offset, limit }: BaseLikeQueryType) => Promise<ArticleEntity[]>;
  updateUser: ({ id, email, nickname, image }: UpdateUserParams) => Promise<PersistedUserEntity>;
  updatePasswordUser: ({ id, password, updatePassword }: UpdatePasswordUserParams) => Promise<PersistedUserEntity>;
  deleteUser: ({ id }: DeleteUserParams) => Promise<void>;
}

type BaseUserQueryType = BaseQueryType<UserSort> & {
  id: string;
};
type BaseLikeQueryType = BaseQueryType<UserSort> & {
  id: string;
};
type BaseUserParamsType = {
  id: string;
  email: string;
  nickname: string;
  image: string;
  password: string;
  updatePassword: string;
}
type SignUpUserParams = Omit<BaseUserParamsType, "id" | "updatePassword">;
type GetUserParams = Pick<BaseUserParamsType, "id">;
type UpdateUserParams = {
  id: string;
  email?: string;
  nickname?: string;
  image?: string;
};
type UpdatePasswordUserParams = Pick<BaseUserParamsType, "id" | "password" | "updatePassword">;
type DeleteUserParams = Pick<BaseUserParamsType, 'id'>;

export class UserService extends BaseService implements IUserService {
  private _hashManager;

  constructor(repos: IRepos, managers: IManagers) {
    super(repos)
    this._hashManager = managers.hash;
  }

  signUpUser = async ({ email, nickname, image, password }: SignUpUserParams) => {
    const foundUser = await this._repos.user.findUserByEmail(email);

    if (foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_EXIST });
    }

    const hashPassword = await this._hashManager.hashingPassword(password);

    const newUser = UserEntity.forCreate({
      email,
      nickname,
      image,
      password: hashPassword,
    });
    if (!newUser.email || !newUser.nickname || !newUser.password) {
      throw new Exception({ message: "Required fields are missing"});
    }
    const createdUser = await this._repos.user.create(newUser);

    return createdUser;
  };
  getUser = async ({ id }: GetUserParams) => {
    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }
    return foundUser;
  };
  getUserProducts = async ({ id, offset, limit, sort }: BaseUserQueryType) => {
    const orderBy: { field: UserKeys, sort: Sort } =
      sort === "recent"
        ? {
          field: "updatedAt",
          sort: "desc"
        }
        : sort === "email-asc"
          ? {
            field: "email",
            sort: "asc"
          }
          : {
            field: "email",
            sort: "desc"
          };

    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const productTotalCount = await this._repos.product.count();
    if (productTotalCount < limit) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_OVERFLOW, value: productTotalCount });
    }

    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserProducts = await this._repos.user.findUserProducts({
      id,
      offset,
      limit,
      orderBy,
    });
    if (!foundUserProducts) {
      throw new Exception({ info: EXCEPTIONS.USER_PRODUCTS_NOT_EXIST });
    }

    return { user: foundUser, products: foundUserProducts };
  };
  getUserLikeProducts = async ({ id, offset = 0, limit }: BaseLikeQueryType) => {
    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserLikeProducts = await this._repos.user.findUserLikeProducts(
      id,
      offset,
      limit,
    );
    if (!foundUserLikeProducts) {
      throw new Exception({ info: EXCEPTIONS.USER_LIKEPRODUCTS_NOT_EXIST });
    }

    return foundUserLikeProducts;
  };
  getUserLikeArticles = async ({ id, offset = 0, limit }: BaseLikeQueryType) => {
    if (limit > 20) {
      throw new Exception({ info: EXCEPTIONS.LIMIT_MAX_20 });
    }

    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const foundUserLikeArticles = await this._repos.user.findUserLikeArticles(
      id,
      offset,
      limit,
    );
    if (!foundUserLikeArticles) {
      throw new Exception({ info: EXCEPTIONS.USER_LIKEARTICLES_NOT_EXIST });
    }

    return foundUserLikeArticles;
  };
  updateUser = async ({ id, email, nickname, image }: UpdateUserParams) => {
    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const user = UserEntity.forCreate({ id, email, nickname, image });
    const updateUser = await this._repos.user.update(user);

    return updateUser;
  };
  updatePasswordUser = async ({ id, password, updatePassword }: UpdatePasswordUserParams) => {
    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const isPasswordValid = await this._hashManager.verifyPassword(
      password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new Exception({ info: EXCEPTIONS.PASSWORD_MISMATCH });
    }

    const hashingUpdatePassword =
      await this._hashManager.hashingPassword(updatePassword);
    const user = UserEntity.forCreate({ id, password: hashingUpdatePassword });
    const updatedPassword = await this._repos.user.updatePassword(user);

    return updatedPassword;
  };
  deleteUser = async ({ id }: DeleteUserParams) => {
    const foundUser = await this._repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }
    const deletedUser = await this._repos.user.delete(id);

    return deletedUser;
  };
}
