import { BaseController } from "./base.controller.js";


export class UserController extends BaseController {
    #service
    #auth

    constructor(service, auth) {
        super('/users');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }


    registerRoutes() {
        this.router.post('/signUp', this.signUpMiddleware);
        this.router.post('/signIn', this.signInMiddleware);
        this.router.post('/token/refresh', this.#auth.verifyRefreshToken, this.getNewTokenMiddleware);
        this.router.get('/me', this.#auth.verifyAccessToken, this.userInfoMiddleware);
        this.router.patch('/me', this.#auth.verifyAccessToken, this.#auth.verifyUserAuth, this.editUserInfoMiddleware);
        this.router.get('/me/products', this.#auth.verifyAccessToken, this.userProductsMiddleware)
    }

    getNewTokenMiddleware = async (req, res) => {
        try {
            const {refreshToken} = req.cookies;
            const {userId} = req.auth;
            const accessToken = await this.#auth.refreshToken(userId, refreshToken);
            return res.json({accessToken});
        } catch (error) {
            return next(error);
        }
    }

    userInfoMiddleware = async (req, res) => {
        const user = await this.#service.user.getInfo(req.user.userId);
        return res.json(user);
    }

    signUpMiddleware = async (req, res) => {
        const user = await this.#service.user.createUser(req.body);
        return res.json(user);
    }

    signInMiddleware = async (req, res) => {
        const { accessToken, refreshToken } = await this.#service.user.getTokens(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            sameSite: 'lax',
            secure: true
        })
        return res.json({ accessToken });
    }

    editUserInfoMiddleware = async (req, res) => {
        const updatedUser = await this.#service.user.updateUser({ userId: req.user.userId, info: req.body });
        return res.json(updatedUser);
    }

    userProductsMiddleware = async (req, res) => {
        const products = await this.#service.user.getUserProducts(req.user.userId);
        return res.json(products);
    }
}