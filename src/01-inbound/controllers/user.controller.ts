import { Request, Response } from "express";
import { Authenticator, } from "../../external/authenticator";
import { BaseController } from "./base.controller";
import { userReqSchema } from "../request/req.validator";
import { UserService } from "../../02-domain/service/user.service";


export class UserController extends BaseController {
    #service
    #auth

    constructor(service: UserService, auth: Authenticator) {
        super('/users');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }


    registerRoutes() {
        // 회원가입
        this.router.post(
            '/signUp',
            this.catch(this.signUp)
        );

        // 로그인
        this.router.post(
            '/signIn',
            this.catch(this.signIn)
        );

        // 토큰 재발급
        this.router.post(
            '/token/refresh',
            this.#auth.verifyRefreshToken,
            this.catch(this.getNewToken)
        );
        
        // 내 정보 조회
        this.router.get(
            '/me',
            this.#auth.verifyAccessToken,
            this.catch(this.userInfo)
        );
        
        // 내 정보 수정
        this.router.patch(
            '/me',
            this.#auth.verifyAccessToken,
            this.#auth.verifyUserAuth,
            this.catch(this.editUserInfo)
        );

        // 내 상품 조회
        this.router.get(
            '/me/products',
            this.#auth.verifyAccessToken,
            this.catch(this.userProducts)
        );
    }

    signUp = async (req: Request, res: Response) => {
        const userReqDto = this.validate(userReqSchema, req.body);
        const userResDto = await this.#service.createUser(userReqDto);
        return res.json(userResDto);
    }

    signIn = async (req: Request, res: Response) => {
        const { accessToken, refreshToken } = await this.#service.getTokens(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true
        })
        return res.json({ accessToken });
    }


    getNewToken = async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies;
        const { userId } = req.auth;
        const accessToken = await this.#auth.refreshToken(userId, refreshToken);
        return res.json({ accessToken });
    }

    userInfo = async (req: Request, res: Response) => {
        const user = await this.#service.getInfo(req.user.userId);
        return res.json(user);
    }


    editUserInfo = async (req: Request, res: Response) => {
        const updatedUser = await this.#service.updateUser({ userId: req.user.userId, info: req.body });
        return res.json(updatedUser);
    }

    userProducts = async (req: Request, res: Response) => {
        const products = await this.#service.getUserProducts(req.user.userId);
        return res.json(products);
    }
}