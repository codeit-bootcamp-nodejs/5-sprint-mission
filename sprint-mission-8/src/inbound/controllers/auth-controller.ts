import { IService } from "../../domain/service";
import { IConfigUtil } from "../../shared/config";
import BadRequestError from "../../shared/errors/BadRequestError";
import { IAuthController } from "../controller";
import { Middlewares } from "../middlewares";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export class AuthController extends BaseController implements IAuthController {
  constructor(
    middlewares: Middlewares,
    service: IService,
    configUtils: IConfigUtil,
  ) {
    super("/auth", middlewares, service, configUtils);
    this.register();
  }

  register() {
    this.router.post("/signup", this.catch(this.signUp));
    this.router.post("/login", this.catch(this.login));
    this.router.post("/logout", this.catch(this.logout));
    this.router.post("/refresh", this.catch(this.reissueTokens));
  }

  signUp = async (req: Request, res: Response) => {
    const result = await this.service.auth.signUp(req.body);
    res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", data: result });
  };

  login = async (req: Request, res: Response) => {
    const result = await this.service.auth.login(req.body);

    res.status(201).json({
      message: "로그인되었습니다. 안녕하세요!",
      data: result,
    });
  };

  logout = async (req: Request, res: Response) => {
    this.clearTokenCookies(res);
    res.status(200).send({ message: "로그아웃 되었습니다." });
  };

  reissueTokens = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new BadRequestError("리프레시 토큰을 가져올 수 없습니다");
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
    const isSecure = process.env.NODE_ENV === "production";

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
