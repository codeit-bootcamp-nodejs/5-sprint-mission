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

    signUp = async (req: Request, res: Response) => {
        const userReqDto = this.validate(userReqSchema, req.body); 
        const userResDto = await this.#service.userService.createUser(userReqDto);
        return res.json(userResDto);
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



    editUserInfo = async (req: Request, res: Response) => {
        const updatedUser = await this.#service.userService.updateUser({ userId: req.user.userId, info: req.body });
        return res.json(updatedUser);
    }

    userProducts = async (req: Request, res: Response) => {
        const products = await this.#service.userService.getUserProducts(req.user.userId);
        return res.json(products);
    }
}