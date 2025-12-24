import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BaseRouter } from "./base.router";

export class UserRouter extends BaseRouter {
  constructor(
    private readonly _authMiddleware: AuthMiddleware,
    private readonly _userController: UserController
  ) {
    super("/api/user");
    this.registerUserRouter();
  }

  registerUserRouter = () => {
    this.router.post(
      "/sign-in",
      this.catchException(this._userController.signInUserController),
    );
    this.router.post(
      "/sign-up",
      this.catchException(this._userController.signUpUserController),
    );
    this.router.get(
      "/sign-out",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.signOutUserController),
    );
    this.router.post(
      "/token/refresh",
      this.catchException(this._userController.refreshTokensController),
    );
    this.router.get(
      "/me",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.getUserController),
    );
    this.router.get(
      "/me/products",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.getUserProductsController),
    );
    this.router.get(
      "/me/like/products",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.getUserLikeProductsController),
    );
    this.router.get(
      "/me/like/articles",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.getUserLikeArticlesController),
    );
    this.router.patch(
      "/me",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.updateUserController),
    );
    this.router.patch(
      "/me/password/",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.updateUserPasswordController),
    );
    this.router.delete(
      "/me",
      this.catchException(this._authMiddleware.isUser),
      this.catchException(this._userController.deleteUserController),
    );
  };
}
