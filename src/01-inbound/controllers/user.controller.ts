import { Request, Response } from "express";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { BaseController } from "./base.controller";
import { signInBodySchema, signUpBodySchema } from "../request/user.request";
import { UserCommandServiceType } from "../../02-application/command/service/user.command.service";
import { UserQueryServiceType } from "../../02-application/query/service/user.query.service";

export const createUserController = (
  userCommandService: UserCommandServiceType,
  userQueryService: UserQueryServiceType,
  auth: AuthenticatorType,
) => {
  const { basePath, router, validate, errorHandler } = BaseController("/users");

  const registerRoutes = () => {
    // 회원가입
    router.post("/signUp", errorHandler(signUp));

    // 로그인
    router.post("/signIn", errorHandler(signIn));

    // 토큰 재발급
    router.post(
      "/token/refresh",
      errorHandler(auth.verifyRefreshToken),
      errorHandler(getNewToken),
    );

    // 내 정보 수정
    router.patch(
      "/me",
      errorHandler(auth.verifyAccessToken),
      errorHandler(auth.verifyUserAuth),
      errorHandler(editUserInfo),
    );

    // 내 정보 조회
    router.get(
      "/me",
      errorHandler(auth.verifyAccessToken),
      errorHandler(userInfo),
    );

    // 내 상품 조회
    router.get(
      "/me/products",
      errorHandler(auth.verifyAccessToken),
      errorHandler(userProducts),
    );

    // 내 게시글 조회
    router.get(
      "/me/articles",
      errorHandler(auth.verifyAccessToken),
      errorHandler(userArticles),
    );

    // 내 댓글 조회
    router.get(
      "/me/comments",
      errorHandler(auth.verifyAccessToken),
      errorHandler(userComments),
    );
  };

  const signUp = async (req: Request, res: Response) => {
    const body = validate(signUpBodySchema, req.body);
    const userResDto = await userCommandService.createUser({
      ...body,
    });
    return res.status(201).json(userResDto);
  };

  const signIn = async (req: Request, res: Response) => {
    const body = validate(signInBodySchema, req.body);
    const { accessToken, refreshToken } =
      await userCommandService.getTokens(body);
    await userCommandService.updateRefreshToken({
      email: body.email,
      refreshToken: refreshToken,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return res.json({ accessToken });
  };

  const getNewToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const { userId } = req.auth;
    const accessToken = await auth.refreshToken(userId, refreshToken);
    return res.json({ accessToken });
  };

  const userInfo = async (req: Request, res: Response) => {
    const user = await userQueryService.getInfo(req.user.userId);
    return res.json(user);
  };

  const editUserInfo = async (req: Request, res: Response) => {
    const body = validate(signUpBodySchema, req.body);
    const updatedUser = await userCommandService.updateUser({
      ...body,
      userId: req.user.userId,
    });
    return res.json(updatedUser);
  };

  const userProducts = async (req: Request, res: Response) => {
    const products = await userQueryService.getUserProducts(req.user.userId);
    return res.json(products);
  };

  const userArticles = async (req: Request, res: Response) => {
    const articles = await userQueryService.getUserArticles(req.user.userId);
    return res.json(articles);
  };

  const userComments = async (req: Request, res: Response) => {
    const comments = await userQueryService.getUserComments(req.user.userId);
    return res.json(comments);
  };

  registerRoutes();

  return {
    basePath,
    router,
  };
};
