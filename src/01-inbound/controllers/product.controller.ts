import { Request, Response } from "express";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productReqSchema, querySchema } from "../request/req.validator";
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
        this.router.get('/', this.getProducts);
        this.router.get('/:id', this.getProduct);
        this.router.patch('/:id/likes', this.#auth.verifyAccessToken, this.likeProduct);
        this.router.post('/', this.#auth.verifyAccessToken, this.createProduct);
        this.router.patch('/:id', this.#auth.verifyAccessToken, this.#auth.verifyProductAuth, this.updateProduct);
        this.router.delete('/:id', this.#auth.verifyAccessToken, this.#auth.verifyProductAuth, this.deleteProduct);
    }

    likeProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const product = await this.#service.product.likeProduct(id);
        return res.json(product);
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

    createProduct = async (req: Request, res: Response) => { //
        const body = this.validate(productReqSchema, req.body);
        const newProductResDto = await this.#service.product.createProduct({
            ...body,
            userId: req.user.userId
        })
        return res.status(201).json(newProductResDto);
    }

    updateProduct = async (req: Request, res: Response) => {
        const body = this.validate(productReqSchema, req.body);
        const params = this.validate(productReqSchema, req.params);
        const query = this.validate(productReqSchema, req.query);

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
        await this.#service.product.deleteProduct(id);
        res.status(200).json();
    }
}
