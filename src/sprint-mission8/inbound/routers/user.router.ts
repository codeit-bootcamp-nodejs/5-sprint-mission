import { IUtils } from "../../shared/util";
import { Controllers } from "../controllers";
import { BaseRouter } from "./base.router";

export class UserRouter extends BaseRouter {
  constructor(controllers: Controllers, utils: IUtils) {
    super("/api/user", controllers, utils);
    this.registerUserRouter();
  }

  registerUserRouter = () => {
    this.router.post(
      "/sign-in",
      this.catchException(this.controllers.user.signInUserController),
    );
    this.router.post(
      "/sign-up",
      this.catchException(this.controllers.user.signUpUserController),
    );
    this.router.get(
      "/sign-out",
      this.isAuthenticate,
      this.catchException(this.controllers.user.signOutUserController),
    );
    this.router.post(
      "/token/refresh",
      this.catchException(this.controllers.user.refreshTokensController),
    );
    this.router.get(
      "/me",
      this.isAuthenticate,
      this.catchException(this.controllers.user.getUserController),
    );
    this.router.get(
      "/me/products",
      this.isAuthenticate,
      this.catchException(this.controllers.user.getUserProductsController),
    );
    this.router.get(
      "/me/like/products",
      this.isAuthenticate,
      this.catchException(this.controllers.user.getUserLikeProductsController),
    );
    this.router.get(
      "/me/like/articles",
      this.isAuthenticate,
      this.catchException(this.controllers.user.getUserLikeArticlesController),
    );
    this.router.patch(
      "/me",
      this.isAuthenticate,
      this.catchException(this.controllers.user.updateUserController),
    );
    this.router.patch(
      "/me/password/",
      this.isAuthenticate,
      this.catchException(this.controllers.user.updateUserPasswordController),
    );
    this.router.delete(
      "/me",
      this.isAuthenticate,
      this.catchException(this.controllers.user.deleteUserController),
    );
  };
}
