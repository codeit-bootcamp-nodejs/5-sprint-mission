import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import { Exception } from '../common/exception/exception.js';




export class Authenticator {

    verifyAccessToken;
    verifyRefreshToken;
    #repos;

    constructor(repos) {
        this.verifyAccessToken = expressjwt({
            secret: process.env.JWT_SECRET,
            algorithms: ['HS256'],
            requestProperty: 'user'
        });

        this.verifyRefreshToken = expressjwt({
            secret: process.env.JWT_SECRET,
            algorithms: ['HS256'],
            getToken: (req) => { 
                return req.cookies?.refreshToken;
            },
        })

        this.#repos = repos;
    }


    filterSensitiveUserData(user) {
        const { password, refreshToken, ...nonSensitiveUserData } = user;
        return nonSensitiveUserData;
    }

    async verifyPassword(inputPassword, savedPassword) {
        const isMatch = await bcrypt.compare(inputPassword, savedPassword);
        if (!isMatch) {
            const error = new Error('Unauthorized');
            error.code = 401;
            throw error;
        }
    }

    async createHashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }


    createToken = (user, type) => {
        const payload = { userId: user.id };
        const options = { 
            expiresIn: type === 'refresh' ? '2w' : '1h',
        };
        return jwt.sign(payload, process.env.JWT_SECRET, options);
    }

    
    refreshToken = async (userId, refreshToken) => {
        const user = await this.#repos.userRepo.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            const error = new Error('Unauthorized');
            error.code = 401;
            throw error; 
        }

        return this.createToken(user);
    }


    verifyProductAuth = async (req, res, next) => {
        const { id } = req.params;

        try {
            const product = await this.#repos.productRepo.findById(id);

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


    verifyArticleAuth = async (req, res, next) => {
        const { id } = req.params;

        try {
            const article = await this.#repos.articleRepo.findById(id);
            
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

    verifyCommentAuth = async (req, res, next) => {
        const { id } = req.params;

        try {
            const comment = await this.#repos.commentRepo.findById(id);
    

            if (!comment) {
                throw new Exception('댓글을 찾을 수 없습니다', 404);
            }



            if (comment.userId !== req.user.userId) {
                throw new Exception('[댓글 수정/삭제] : 본인 댓글만 수정/삭제할 수 있습니다', 403);
            }
            return next();
        } catch (error) {
            return next(error);
        }
    }


    verifyUserAuth = async (req, res, next) => {

        try {
            const userId = req.user.userId
            const user = await this.#repos.userRepo.findById(userId);

            if (!user) {
                throw new Exception('유저를 찾을 수 없습니다', 404);
            }


            return next();
        } catch (error) {
            return next(error);
        }
    }
}