import { NextFunction, Request, Response } from "express";
import { IService } from "../../03-domain/I.service";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller";
import { userReqSchema } from "../req-validator/req.validator";


export class UserController extends BaseController {
    #service
    #auth

    constructor(service: IService, auth: Authenticator) {
        super('/users');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }


    registerRoutes() { 
        this.router.post('/signUp', this.signUp); 
        this.router.post('/signIn', this.signIn);
        this.router.post('/token/refresh', this.#auth.verifyRefreshToken, this.getNewToken);
        this.router.get('/me', this.#auth.verifyAccessToken, this.userInfo);
        this.router.patch('/me', this.#auth.verifyAccessToken, this.#auth.verifyUserAuth, this.editUserInfo);
        this.router.get('/me/products', this.#auth.verifyAccessToken, this.userProducts)
    }

    getNewToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.cookies;
            const { userId } = req.auth;
            const accessToken = await this.#auth.refreshToken(userId, refreshToken);
            return res.json({ accessToken });
        } catch (error) {
            return next(error);
        }
    }

    userInfo = async (req: Request, res: Response) => {
        const user = await this.#service.userService.getInfo(req.user.userId);
        return res.json(user);
    }

    signUp = async (req: Request, res: Response) => {
        const result = userReqSchema.safeParse({ body: req.body });

        if (result.success) {
            const user = await this.#service.userService.createUser(result.data);
            return res.json(user);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Body가 유효하지 않습니다";
            throw new HttpError(errorMessage, 401);
        }
    }

    signIn = async (req: Request, res: Response) => {

        const { accessToken, refreshToken } = await this.#service.userService.getTokens(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true
        })
        return res.json({ accessToken });
    }

    editUserInfo = async (req: Request, res: Response) => {
        const updatedUser = await this.#service.userService.updateUser({ userId: req.user.userId, info: req.body });
        return res.json(updatedUser);
    }

    userProducts = async (req: Request, res: Response) => {
        const products = await this.#service.userService.getUserProducts(req.user.userId);
        return res.json(products);
    }
}