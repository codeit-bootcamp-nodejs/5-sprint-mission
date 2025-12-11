import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { Authenticator } from "../../external/authenticator";
import { querySchema, articleBodySchema, articleParamSchema } from "../request/req.validator";
import { ArticleService } from "../../02-domain/service/article.service";


export const ArticleController = (_service: ArticleService, _auth: Authenticator) => {
    const { basePath, router, validate, errorHandler } = BaseController('/articles');
    const service = _service;
    const auth = _auth;



    const registerRoutes = () => {
        // 모든 글 조회
        router.get(
            '/',
            errorHandler(getArticles)
        );

        // 특정 글 조회
        router.get(
            '/:id',
            errorHandler(getArticle)
        );

        // 글 작성
        router.post(
            '/',
            errorHandler(#auth.verifyAccessToken),
            errorHandler(createArticle)
        );


        // 글 수정
        router.patch(
            '/:id',
            errorHandler(#auth.verifyAccessToken),
            errorHandler(updateArticle)
        );

        // 글 삭제
        router.delete(
            '/:id',
            errorHandler(#auth.verifyAccessToken),
            errorHandler(deleteArticle)
        );
    }


    const getArticles = async (req: Request, res: Response) => {
        const articleReqDto = validate(querySchema, req.query);
        const articlesResDtos = await service.getAllArticles(articleReqDto);
        return res.json(articlesResDtos);
    }

    const getArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const articleResDto = await service.getArticle(id);
        return res.json(articleResDto);
    }

    const createArticle = async (req: Request, res: Response) => {
        const body = validate(articleBodySchema, req.body);
        const params = validate(articleParamSchema, req.params);

        const articleResDto = await service.createArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });

        return res.status(201).json(articleResDto);
    }


    const updateArticle = async (req: Request, res: Response) => {
        const body = validate(articleBodySchema, req.body);
        const params = validate(articleParamSchema, req.params);

        const articleResDto = await service.updateArticle({
            ...body,
            ...params,
            userId: req.user.userId
        });
        return res.status(200).json(articleResDto);
    }

    const deleteArticle = async (req: Request, res: Response) => {
        const id = req.params.id;
        const userId = req.user.userId;
        await service.deleteArticle(id, userId);
        res.status(200).json();
    }

    registerRoutes();

    return {
        basePath,
        router
    }
}