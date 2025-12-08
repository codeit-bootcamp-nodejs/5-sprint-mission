import bcrypt, { hash } from 'bcrypt'
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { Exception } from '../common/exception/exception';
import { BaseRepository } from '../03-outbound/repo/base.repository';
import { NextFunction, Request, Response } from 'express';
import { IBaseRepository } from '../02-domain/port/I.base.repository';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';



export class HttpError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}


export class Authenticator {

    verifyAccessToken;
    verifyRefreshToken;
    #repos;

    constructor(repos: IBaseRepository) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Exception("JWT 비밀키가 존재하지 않습니다!", 401);
        }

        this.verifyAccessToken = expressjwt({
            secret: jwtSecret,
            algorithms: ['HS256'],
            requestProperty: 'user'
        });

        this.verifyRefreshToken = expressjwt({
            secret: jwtSecret,
            algorithms: ['HS256'],
            getToken: (req) => {
                return req.cookies?.refreshToken;
            },
        })

        this.#repos = repos;
    }

    checkAuthWs = (socket: Socket, next: (err?: ExtendedError) => void) => {
        const authHeader = socket.handshake.headers.authorization;
        if (
            !authHeader ||
            authHeader.split(" ").length !== 2 ||
            authHeader.split(" ")[0] !== "Bearer"
        ) {
            return next();
        }

        const accessToken = authHeader.split(" ")[1];
        try {
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET !) as { userId: string };
            socket.data.userId = payload.userId;
        } catch (err) { }
        return next();
    };


    filterSensitiveUserData(user: any) {
        const { password, refreshToken, ...nonSensitiveUserData } = user;
        return nonSensitiveUserData;
    }

    async verifyPassword(inputPassword: string, savedPassword: string) {
        const isMatch = await bcrypt.compare(inputPassword, savedPassword);
        if (!isMatch) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }
    }

    async createHashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }


    createToken(user: any, type?: 'access' | 'refresh') {
        const payload = { userId: user.id };
        const options: SignOptions = {
            expiresIn: type === 'refresh' ? '2w' : '1h',
        };

        const jwtToken: Secret = process.env.JWT_SECRET!;
        return jwt.sign(payload, jwtToken, options);
    }


    refreshToken = async (userId: string, refreshToken: string) => {
        const user = await this.#repos.user.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        return this.createToken(user);
    }


    verifyProductAuth = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const product = await this.#repos.product.findById(id);

            if (!product) {
                throw new Exception('상품을 찾을 수 없습니다', 404);
            }


            if (product.userId !== req.user.userId) {
                throw new Exception('[상품 수정/삭제 실패] : 본인 상품만 수정/삭제할 수 있습니다', 403);
            }
            return next();
        } catch (error) {
            return next(error);
        }
    }



    verifyArticleAuth = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const article = await this.#repos.article.findById(id);

            if (!article) {
                throw new Exception('글을 찾을 수 없습니다', 404);
            }


            if (article.userId !== req.user.userId) {
                throw new Exception('[글 수정/삭제] : 본인 글만 수정/삭제할 수 있습니다', 403);
            }
            return next();
        } catch (error) {
            return next(error);
        }
    }

    // verifyCommentAuth = async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params;

    //     try {
    //         const comment = await this.#repos.commentRepo.findById(id);


    //         if (!comment) {
    //             throw new Exception('댓글을 찾을 수 없습니다', 404);
    //         }



    //         if (comment.userId !== req.user.userId) {
    //             throw new Exception('[댓글 수정/삭제] : 본인 댓글만 수정/삭제할 수 있습니다', 403);
    //         }
    //         return next();
    //     } catch (error) {
    //         return next(error);
    //     }
    // }


    verifyUserAuth = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const userId = req.user.userId
            const user = await this.#repos.user.findById(userId);

            if (!user) {
                throw new Exception('유저를 찾을 수 없습니다', 404);
            }


            return next();
        } catch (error) {
            return next(error);
        }
    }
}