import { BaseRouter } from "./base.router.js";

export class UserRouter extends BaseRouter{
  #controllers
  
  constructor(controllers, managers) {
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
    this.router.post(
      "/sign-out",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.signOutUserController),
    );
    this.router.post(
      "/token/refresh",
      this.catchException(this.#controllers.user.refreshTokensController),
    );
    this.router.get(
      "/me",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.getUserController),
    );
    this.router.get(
      "/me/products",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.getUserProductsController),
    );
    this.router.patch(
      "/me",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.updateUserController),
    );
    this.router.patch(
      "/me/password/",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.updateUserPasswordController),
    );
    this.router.delete(
      "/me",
      this.inAuthenticate,
      this.catchException(this.#controllers.user.deleteUserController),
    );
  }
}