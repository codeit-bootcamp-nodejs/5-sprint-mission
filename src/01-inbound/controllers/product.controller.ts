import { Request, Response } from "express";
import { Authenticator, AuthenticatorType, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productBodySchema, productParamSchema, querySchema } from "../request/req.validator";
import { ProductServiceType } from "../../02-domain/service/product.service";




export const createProductController = (service: ProductServiceType, auth: AuthenticatorType) => {

    const { basePath,
        router,
        validate,
        errorHandler } = BaseController('/products');


    const registerRoutes = () => {

        // 상품 생성
        router.post(
            '/',
            errorHandler(auth.verifyAccessToken),
            errorHandler(createProduct)
        );

        // 상품 조회
        router.get(
            '/',
            errorHandler(getProducts)
        );

        // 상품 상세 조회
        router.get(
            '/:id',
            errorHandler(getProduct)
        );

        // 상품 수정
        router.patch(
            '/:id',
            errorHandler(auth.verifyAccessToken),
            errorHandler(updateProduct)
        );

        // 상품 삭제
        router.delete(
            '/:id',
            errorHandler(auth.verifyAccessToken),
            errorHandler(deleteProduct)
        );

        // 상품 좋아요
        router.patch(
            '/:id/likes',
            errorHandler(auth.verifyAccessToken),
            errorHandler(likeProduct)
        );
    }

    const createProduct = async (req: Request, res: Response) => { //
        const body = validate(productBodySchema, req.body);
        const params = validate(productParamSchema, req.params);
        const newProductResDto = await service.createProduct({
            ...body,
            ...params,
            userId: req.user.userId
        })
        return res.status(201).json(newProductResDto);
    }

    const getProducts = async (req: Request, res: Response) => {
        const query = validate(querySchema, req.query);
        const productsResDto = await service.getAllProducts(query);
        return res.json(productsResDto);
    }

    const getProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const productResDto = await service.getProduct(id);
        return res.json(productResDto);
    }

    const updateProduct = async (req: Request, res: Response) => {
        const body = validate(productBodySchema, req.body);
        const params = validate(productParamSchema, req.params);
        const query = validate(querySchema, req.query);

        const updatedProductResDto = await service.updateProduct({
            ...body,
            ...params,
            ...query,
            userId: req.user.userId
        });
        res.status(201).json(updatedProductResDto);
    }

    const deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const userId = req.user.userId;
        await service.deleteProduct(id, userId);
        res.status(200).json();
    }

    const likeProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const product = await service.likeProduct(id);
        return res.json(product);
    }

    registerRoutes();

    return {
        basePath,
        router
    }
}
