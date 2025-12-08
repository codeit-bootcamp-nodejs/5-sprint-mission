import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Authenticator, HttpError } from "../../external/authenticator";
import { IServices } from "../port/i.service";
import { querySchema, articleBodySchema, articleParamSchema } from "../request/req.validator";


export class ArticleController extends BaseController {
    #service
    #auth

    constructor(service: IServices, auth: Authenticator) {
        super('/articles');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        // 모든 글 조회
        this.router.get(
            '/',
            this.catch(this.getArticles)
        );

        // 특정 글 조회
        this.router.get(
            '/:id',
            this.catch(this.getArticle)
        );

        // 글 작성
        this.router.post(
            '/',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.createArticle)
        );


        // 글 수정
        this.router.patch(
            '/:id',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.updateArticle)
        );

        // 글 삭제
        this.router.delete(
            '/:id',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.deleteArticle)
        );
    }

    getArticles = async (req: Request, res: Response) => {
        const articleReqDto = this.validate(querySchema, req.query);
        const articlesResDtos = await this.#service.article.getAllArticles(articleReqDto);
        return res.json(articlesResDtos);
    }

    getArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const articleResDto = await this.#service.article.getArticle(id);
        return res.json(articleResDto);
    }

    createArticle = async (req: Request, res: Response) => {
        const body = this.validate(articleBodySchema, req.body);
        const params = this.validate(articleParamSchema, req.params);

        const articleResDto = await this.#service.article.createArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.status(201).json(articleResDto);
    }


    updateArticle = async (req: Request, res: Response) => {
        const body = this.validate(articleBodySchema, req.body);
        const params = this.validate(articleParamSchema, req.params);

        const articleResDto = await this.#service.article.updateArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.status(200).json(articleResDto);
    }

    deleteArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const userId = req.user.userId;
        await this.#service.article.deleteArticle(id, userId);
        res.status(200).json();
    }
}