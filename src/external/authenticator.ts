import bcrypt, { hash } from 'bcrypt'
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { Exception } from '../common/exception/exception';
import { NextFunction, Request, Response } from 'express';
import { IBaseRepository } from '../02-domain/port/I.base.repository';
import { ExtendedError } from 'socket.io/dist/namespace';
import { Socket } from 'socket.io/dist/socket';



export class HttpError extends Error {
    constructor(message: string, code: number) {
        super(message);
        code = code;
    }
}


export const Authenticator = (repos: IBaseRepository) => {



    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Exception("JWT 비밀키가 존재하지 않습니다!", 401);
    }

    const verifyAccessToken = expressjwt({
        secret: jwtSecret,
        algorithms: ['HS256'],
        requestProperty: 'user'
    });

    const verifyRefreshToken = expressjwt({
        secret: jwtSecret,
        algorithms: ['HS256'],
        getToken: (req) => {
            return req.cookies?.refreshToken;
        },
    })




    const checkAuthWs = (socket: Socket, next: (err?: ExtendedError) => void) => {
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
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as { userId: string };
            socket.data.userId = payload.userId;
        } catch (err) { }
        return next();
    };


    const filterSensitiveUserData = (user: any) => {
        const { password, refreshToken, ...nonSensitiveUserData } = user;
        return nonSensitiveUserData;
    }

    const verifyPassword = async (inputPassword: string, savedPassword: string) => {
        const isMatch = await bcrypt.compare(inputPassword, savedPassword);
        if (!isMatch) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }
    }

    const createHashPassword = async (password: string) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }


    const createToken = (user: any, type?: 'access' | 'refresh') => {
        const payload = { userId: user.id };
        const options: SignOptions = {
            expiresIn: type === 'refresh' ? '2w' : '1h',
        };

        const jwtToken: Secret = process.env.JWT_SECRET!;
        return jwt.sign(payload, jwtToken, options);
    }


    const refreshToken = async (userId: string, refreshToken: string) => {
        const user = await repos.user.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            const error = new HttpError('Unauthorized', 401);
            throw error;
        }

        return createToken(user);
    }



    const verifyUserAuth = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const userId = req.user.userId
            const user = await repos.user.findById(userId);

            if (!user) {
                throw new Exception('유저를 찾을 수 없습니다', 404);
            }

            return next();
        } catch (error) {
            return next(error);
        }
    }

    return {
        verifyAccessToken,
        verifyRefreshToken,
        filterSensitiveUserData,
        verifyPassword,
        createHashPassword,
        createToken,
        refreshToken,
        checkAuthWs,
        verifyUserAuth
    }
}

export type AuthenticatorType = ReturnType<typeof Authenticator>;