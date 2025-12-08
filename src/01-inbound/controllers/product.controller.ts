import { Request, Response } from "express";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productBodySchema, productParamSchema, querySchema } from "../request/req.validator";
import { IServices } from "../port/i.service";




export class ProductController extends BaseController {
    #service
    #auth

    constructor(service: IServices, auth: Authenticator) {
        super('/products');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {

        // 상품 생성
        this.router.post(
            '/',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.createProduct)
        );

        // 상품 조회
        this.router.get(
            '/',
            this.catch(this.getProducts)
        );

        // 상품 상세 조회
        this.router.get(
            '/:id',
            this.catch(this.getProduct)
        );

        // 상품 수정
        this.router.patch(
            '/:id',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.updateProduct)
        );

        // 상품 삭제
        this.router.delete(
            '/:id',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.deleteProduct)
        );

        // 상품 좋아요
        this.router.patch(
            '/:id/likes',
            this.catch(this.#auth.verifyAccessToken),
            this.catch(this.likeProduct)
        );
    }

    createProduct = async (req: Request, res: Response) => { //
        const body = this.validate(productBodySchema, req.body);
        const params = this.validate(productParamSchema, req.params);
        const newProductResDto = await this.#service.product.createProduct({
            ...body,
            ...params,
            userId: req.user.userId
        })
        return res.status(201).json(newProductResDto);
    }

    getProducts = async (req: Request, res: Response) => {
        const query = this.validate(querySchema, req.query);
        const productsResDto = this.#service.product.getAllProducts(query);
        return res.json(productsResDto);
    }

    getProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const productResDto = await this.#service.product.getProduct(id);
        return res.json(productResDto);
    }

    updateProduct = async (req: Request, res: Response) => {
        const body = this.validate(productBodySchema, req.body);
        const params = this.validate(productParamSchema, req.params);
        const query = this.validate(querySchema, req.query);

        const updatedProductResDto = await this.#service.product.updateProduct({
            ...body,
            ...params,
            ...query,
            userId: req.user.userId
        });
        res.status(201).json(updatedProductResDto);
    }

    deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const userId = req.user.userId;
        await this.#service.product.deleteProduct(id, userId);
        res.status(200).json();
    }

    likeProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const product = await this.#service.product.likeProduct(id);
        return res.json(product);
    }
}
