import { Exception } from "../../common/const/exception.js";
import { User } from "../entity/user.js";

export class UserService {
  #repos;
  #managers;

  constructor(repos, managers) {
    this.#repos = repos;
    this.#managers = managers;
  }

  signUpUser = async ({ email, nickname, image, password }) => {
    const foundUser = await this.#repos.user.findUserByEmail(email);

    if (foundUser) {
      throw new Exception("USER_EXIST");
    }

    const hashPassword = await this.#managers.hash.hashingPassword(password);

    const newUser = User.forCreate({
      email,
      nickname,
      image,
      password: hashPassword,
    });
    const createdUser = await this.#repos.user.create(newUser);

    return createdUser;
  };
  getUser = async ({ id }) => {
    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }
    return foundUser;
  };
  getUserProducts = async ({ id, offset, limit, sort }) => {
    const orderBy =
      sort === "recent"
        ? { updatedAt: "desc" }
        : sort === "priceLowest"
          ? { price: "asc" }
          : { price: "desc" };

    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const productTotalCount = await this.#repos.product.count();
    if (productTotalCount < limit) {
      throw new Exception("LIMIT_OVERFLOW", { totalCount: productTotalCount });
    }

    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }

    const foundUserProducts = await this.#repos.user.findUserProducts(
      id,
      offset,
      limit,
      orderBy,
    );
    if (!foundUserProducts) {
      throw new Exception("USER_PRODUCTS_NOT_EXSIST");
    }

    return { user: foundUser, products: foundUserProducts };
  };
  getUserLikeProducts = async ({ id, offset, limit }) => {
    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }

    const foundUserLikeProducts = await this.#repos.user.findUserLikeProducts(
      id,
      offset,
      limit,
    );
    if (!foundUserLikeProducts) {
      throw new Exception("USER_LIKEPRODUCTS_NOT_EXSIST");
    }

    return foundUserLikeProducts;
  };
  getUserLikeArticles = async ({ id, offset, limit }) => {
    if (limit > 20) {
      throw new Exception("LIMIT_MAX_20");
    }

    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }

    const foundUserLikeArticles = await this.#repos.user.findUserLikeArticles(
      id,
      offset,
      limit,
    );
    if (!foundUserLikeArticles) {
      throw new Exception("USER_LIKEARTICLES_NOT_EXSIST");
    }

    return foundUserLikeArticles;
  };
  updateUser = async ({ id, email, nickname, image }) => {
    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }

    const user = User.forCreate({ id, email, nickname, image });
    const updateUser = await this.#repos.user.update(user);

    return updateUser;
  };
  updatePasswordUser = async ({ id, password, updatePassword }) => {
    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }

    const isPasswordValid = await this.#managers.hash.verifyPassword(
      password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new Exception("PASSWORD_MISMATCH");
    }

    const hashingUpdatePassword =
      await this.#managers.hash.hashingPassword(updatePassword);
    const user = User.forCreate({ id, password: hashingUpdatePassword });
    const updatedPassword = await this.#repos.user.updatePassword(user);

    return updatedPassword;
  };
  deleteUser = async ({ id }) => {
    const foundUser = await this.#repos.user.findUserById(id);
    if (!foundUser) {
      throw new Exception("USER_NOT_EXSIST");
    }
    const deletedUser = await this.#repos.user.delete(id);

    return deletedUser;
  };
}
