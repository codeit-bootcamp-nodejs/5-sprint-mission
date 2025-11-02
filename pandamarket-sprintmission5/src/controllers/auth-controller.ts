import { IService } from "../domain/service.js";
import { BaseController } from "./base-controller.js";
import { Request, Response } from "express";

export interface IAuthController {
  handleSignUp: (req: Request, res: Response) => Promise<void>;
  handleLogin: (req: Request, res: Response) => Promise<void>;
  handleLogout: (req: Request, res: Response) => Promise<void>;
  handleReissueTokens: (req: Request, res: Response) => Promise<void>;
  setTokenCookies: (
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) => Promise<void>;
  clearTokenCookies: (res: Response) => Promise<void>;
}

export class AuthController extends BaseController implements IAuthController {
  constructor(service: IService) {
    super(service);
  }

  handleSignUp = async (req: Request, res: Response) => {
    const result = await this.service.auth.signUp(req.body);
    res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", data: result });
  };

  handleLogin = async (req: Request, res: Response) => {
    const result = await this.service.auth.login(req.body);
    res.status(201).json({
      message: "로그인되었습니다. 안녕하세요`${req.user.nickname}님!`",
      data: result,
    });
  };

  handleLogout = async (req: Request, res: Response) => {
    this.clearTokenCookies(res);
    res.status(200).send();
  };

  handleReissueTokens = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error("리프레시 토큰을 가져올 수 없습니다");
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.service.auth.reissueTokens(refreshToken);

    this.setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json();
  };

  setTokenCookies = async (
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) => {
    const isSecure = NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isSecure,
      maxAge: 1 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isSecure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/auth/refresh",
    });
  };

  clearTokenCookies = async (res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  };
}
