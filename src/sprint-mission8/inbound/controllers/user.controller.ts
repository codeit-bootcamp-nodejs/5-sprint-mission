import { NextFunction, Request, Response } from "express";
import { BaseController, ControllerHandler } from "./base.controller";
import { refreshTokensReqSchema, signInReqSchema, signUpReqSchema, updatePasswordReqSchema, updateReqSchema, userIdReqSchema, userLikeListReqSchema, userProductsReqSchema } from "../requests/user/user.req.schemas";
import { SignInResDto } from "../responses/user/signIn.res.dto";
import { UserResDto } from "../responses/user/user.Res.Dto";
import { SignOutResDto } from "../responses/user/signout.res.dto";
import { UserProductsResDto } from "../responses/user/user.products.res.dto";
import { UserLikeProductsResDto } from "../responses/user/user.like.products.dto";
import { UserLikeArticlesResDto } from "../responses/user/user.like.articles.dto";
import { DeleteUserResDto } from "../responses/user/delete.user.res.dto";
import { RefreshTokensResDto } from "../responses/user/refresh.tokens.res.dto";
import { IServices } from "../port/services.interface";
import { Exception } from "../../shared/exception/exception";
import { EXCEPTIONS } from "../../shared/const/exception.info";

export class UserController extends BaseController{

  constructor(services: IServices) {
    super(services);
  }

  signInUserController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(signInReqSchema.safeParse(req.body));

    const { accessToken, authenticatedUser } =
      await this._authService.signInUser(reqDto);
    if (!authenticatedUser) {
      throw new Exception({ info: EXCEPTIONS.USER_NOT_EXIST });
    }

    const resDto = new SignInResDto(accessToken, authenticatedUser);
    return res.json(resDto);
  };

  signUpUserController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(signUpReqSchema.safeParse(req.body));

    const user = await this._userService.signUpUser(reqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  signOutUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = this.validateOrThrow(userIdReqSchema.safeParse({ userId: req.userId }));

    await this._authService.signOutUser({ id: userId });
    const resDto = new SignOutResDto();
    return res.json(resDto);
  };

  getUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = this.validateOrThrow(userIdReqSchema.safeParse({ userId: req.userId }));

    const user = await this._userService.getUser(userId);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  getUserProductsController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(userProductsReqSchema.safeParse({
      userId: req.userId,
      ...req.query
    }));
    const id = reqDto.userId;
    const { user, products } =
      await this._userService.getUserProducts(reqDto);
    const resDto = new UserProductsResDto({ user, products });
    return res.json(resDto);
  };

  getUserLikeProductsController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(userLikeListReqSchema.safeParse({
      userId: req.userId,
      ...req.query
    }));

    const likeProducts =
      await this._userService.getUserLikeProducts(reqDto);
    const resDto = new UserLikeProductsResDto(likeProducts);

    return res.json(resDto);
  };

  getUserLikeArticlesController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(userLikeListReqSchema.safeParse({
      userId: req.userId,
      ...req.query
    }));

    const likeArticles =
      await this._userService.getUserLikeArticles(reqDto);
    const resDto = new UserLikeArticlesResDto(likeArticles);

    return res.json(resDto);
  };

  updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(updateReqSchema.safeParse({
      userId: req.userId,
      ...req.body
    }));

    const user = await this._userService.updateUser(reqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  updateUserPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    const reqDto = this.validateOrThrow(updatePasswordReqSchema.safeParse({
      userId: req.userId,
      ...req.body
    }));

    const user =
      await this._userService.updatePasswordUser(reqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = this.validateOrThrow(userIdReqSchema.safeParse({ userId: req.userId }));

    await this._userService.deleteUser({ id: userId });
    const resDto = new DeleteUserResDto();
    return res.json(resDto);
  };

  refreshTokensController = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = this.validateOrThrow(refreshTokensReqSchema.safeParse({ refreshToken: req.body.refreshToken }));
    const { accessToken, user } = await this._authService.refreshTokens(refreshToken);

    const resDto = new RefreshTokensResDto({ accessToken, user: user! });
    return res.json(resDto);
  };
}
