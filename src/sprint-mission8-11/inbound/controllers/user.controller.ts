import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import {
  refreshTokensReqSchema,
  signInReqSchema,
  signUpReqSchema,
  updatePasswordReqSchema,
  updateReqSchema,
  userIdReqSchema,
  userLikeListReqSchema,
  userProductsReqSchema,
} from "../requests/user/user.req.schemas";
import { SignInResDto } from "../responses/user/signIn.res.dto";
import { UserResDto } from "../responses/user/user.res.Dto";
import { UserProductsResDto } from "../responses/user/user.products.res.dto";
import { UserLikeProductsResDto } from "../responses/user/user.like.products.dto";
import { UserLikeArticlesResDto } from "../responses/user/user.like.articles.dto";
import { RefreshTokensResDto } from "../responses/user/refresh.tokens.res.dto";
import { AuthCommandService } from "../../application/command/service/auth.command.service";
import { UserCommandService } from "../../application/command/service/user.command.service";
import { UserQueryService } from "../../application/query/services/user.query.service";

export class UserController extends BaseController {
  constructor(
    private readonly _authService: AuthCommandService,
    private readonly _userCommandService: UserCommandService,
    private readonly _userQueryService: UserQueryService,
  ) {
    super();
  }

  signInUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(signInReqSchema.safeParse(req.body));

    const { accessToken, foundUser } =
      await this._authService.signInUser(reqDto);
    const resDto = new SignInResDto(accessToken, foundUser);
    return res.json(resDto);
  };

  signUpUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(signUpReqSchema.safeParse(req.body));

    await this._userCommandService.signUpUser(reqDto);
    return res.sendStatus(200);
  };

  signOutUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { userId } = this.validateOrThrow(
      userIdReqSchema.safeParse({ userId: req.userId }),
    );

    await this._authService.signOutUser(userId);
    return res.sendStatus(200);
  };

  getUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { userId } = this.validateOrThrow(
      userIdReqSchema.safeParse({ userId: req.userId }),
    );

    const user = await this._userQueryService.getUser(userId);
    return res.json(user);
  };

  getUserProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(
      userProductsReqSchema.safeParse({
        userId: req.userId,
        ...req.query,
      }),
    );
    const id = reqDto.userId;
    const products = await this._userQueryService.getProductsBySeller(reqDto);
    return res.json(products);
  };

  getUserLikeProductsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(
      userLikeListReqSchema.safeParse({
        userId: req.userId,
        ...req.query,
      }),
    );

    const likeProducts = await this._userQueryService.getUserLikeProducts(reqDto);

    return res.json(likeProducts);
  };

  getUserLikeArticlesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(
      userLikeListReqSchema.safeParse({
        userId: req.userId,
        ...req.query,
      }),
    );

    // const likeArticles = await this._userCommandService.getUserLikeArticles(reqDto);
    // const resDto = new UserLikeArticlesResDto(likeArticles);

    return res.sendStatus(200);
  };

  updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(
      updateReqSchema.safeParse({
        userId: req.userId,
        ...req.body,
      }),
    );

    const user = await this._userCommandService.updateUser(reqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  updateUserPasswordController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const reqDto = this.validateOrThrow(
      updatePasswordReqSchema.safeParse({
        userId: req.userId,
        ...req.body,
      }),
    );

    const user = await this._userCommandService.updatePasswordUser(reqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  };

  deleteUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { userId } = this.validateOrThrow(
      userIdReqSchema.safeParse({ userId: req.userId }),
    );

    await this._userCommandService.deleteUser(userId);
    return res.sendStatus(200);
  };

  refreshTokensController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { refreshToken } = this.validateOrThrow(
      refreshTokensReqSchema.safeParse({ refreshToken: req.body.refreshToken }),
    );
    const { accessToken, foundUser } =
      await this._authService.refreshTokens(refreshToken);

    const resDto = new RefreshTokensResDto(accessToken, foundUser);
    return res.json(resDto);
  };
}
