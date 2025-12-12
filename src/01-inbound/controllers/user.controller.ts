import { Request, Response } from "express";
import { Authenticator, AuthenticatorType, } from "../../external/authenticator";
import { BaseController } from "./base.controller";
import { userBodySchema } from "../request/req.validator";
import { UserServiceType } from "../../02-domain/service/user.service";


export const createUserController = (service: UserServiceType, auth: AuthenticatorType) => {
    const { basePath,
        router,
        validate,
        errorHandler } = BaseController('/users');




    const registerRoutes = () => {
        // 회원가입
        router.post(
            '/signUp',
            errorHandler(signUp)
        );

        // 로그인
        router.post(
            '/signIn',
            errorHandler(signIn)
        );

        // 토큰 재발급
        router.post(
            '/token/refresh',
            errorHandler(auth.verifyRefreshToken),
            errorHandler(getNewToken)
        );

        // 내 정보 조회
        router.get(
            '/me',
            errorHandler(auth.verifyAccessToken),
            errorHandler(userInfo)
        );

        // 내 정보 수정
        router.patch(
            '/me',
            errorHandler(auth.verifyAccessToken),
            errorHandler(auth.verifyUserAuth),
            errorHandler(editUserInfo)
        );

        // 내 상품 조회
        router.get(
            '/me/products',
            errorHandler(auth.verifyAccessToken),
            errorHandler(userProducts)
        );
    }

    const signUp = async (req: Request, res: Response) => {
        const body = validate(userBodySchema, req.body);
        const userResDto = await service.createUser({
            ...body
        });
        return res.json(userResDto);
    }

    const signIn = async (req: Request, res: Response) => {
        const { accessToken, refreshToken } = await service.getTokens(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true
        })
        return res.json({ accessToken });
    }


    const getNewToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies;
        const { userId } = req.auth;
        const accessToken = await auth.refreshToken(userId, refreshToken);
        return res.json({ accessToken });
    }

    const userInfo = async (req: Request, res: Response) => {
        const user = await service.getInfo(req.user.userId);
        return res.json(user);
    }


    const editUserInfo = async (req: Request, res: Response) => {
        const body = validate(userBodySchema, req.body);
        const updatedUser = await service.updateUser({
            ...body,
            userId: req.user.userId
        });
        return res.json(updatedUser);
    }

    const userProducts = async (req: Request, res: Response) => {
        const products = await service.getUserProducts(req.user.userId);
        return res.json(products);
    }

    registerRoutes();

    return {
        basePath,
        router
    }
}