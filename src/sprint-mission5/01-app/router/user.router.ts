import { IControllers } from "../../02-controller/controllers.js";
import { IManagers } from "../../common/util/managers.js";
import { BaseRouter } from "./base.router.js";

export class UserRouter extends BaseRouter {
  #controllers;

  constructor(controllers: IControllers, managers: IManagers) {
    super("/api/user", managers);
    this.#controllers = controllers;
    this.registerUserRouter();
  }

  registerUserRouter = () => {
    this.router.post(
      "/sign-in",
      this.catchException(this.#controllers.user.signInUserController),
    );
    this.router.post(
      "/sign-up",
      this.catchException(this.#controllers.user.signUpUserController),
    );
    this.router.get(
      "/sign-out",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.signOutUserController),
    );
    this.router.post(
      "/token/refresh",
      this.catchException(this.#controllers.user.refreshTokensController),
    );
    this.router.get(
      "/me",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.getUserController),
    );
    this.router.get(
      "/me/products",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.getUserProductsController),
    );
    this.router.get(
      "/me/like/products",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.getUserLikeProductsController),
    );
    this.router.get(
      "/me/like/articles",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.getUserLikeArticlesController),
    );
    this.router.patch(
      "/me",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.updateUserController),
    );
    this.router.patch(
      "/me/password/",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.updateUserPasswordController),
    );
    this.router.delete(
      "/me",
      this.isAuthenticate,
      this.catchException(this.#controllers.user.deleteUserController),
    );
  };
}
