import { Request, Response } from "express";
import { IService } from "../../03-domain/I.service";
import { Authenticator, HttpError } from "../../external/authenticator";
import { BaseController } from "./base.controller"; // 
import { productReqSchema, querySchema } from "../req-validator/req.validator";




export class ProductController extends BaseController {
    #service
    #auth

    constructor(service: IService, auth: Authenticator) {
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
        const product = await this.#service.productService.likeProduct(id);
        return res.json(product);
    }

    getProducts = async (req: Request, res: Response) => {
        const result = querySchema.safeParse({ query: req.query });
        if (result.success) {
            const productsResDto = await this.#service.productService.getAllProducts(result.data);
            return res.json(productsResDto);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 404);
        }
    }

    getProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const productResDto = await this.#service.productService.getProduct(id);
        return res.json(productResDto);
    }

    createProduct = async (req: Request, res: Response) => { //
        const result = productReqSchema.safeParse({
            body: req.body,
            user: req.user
        })

        console.log(req.body);
        console.log(req.user);

        if (result.success) {
            const newProductResDto = await this.#service.productService.createProduct(result.data);
            return res.status(201).json(newProductResDto);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 401);
        }

    }

    updateProduct = async (req: Request, res: Response) => {
        const result = productReqSchema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
            user: req.user
        })

        if (result.success) {
            const updatedProductResDto = await this.#service.productService.updateProduct(result.data);
            res.status(201).json(updatedProductResDto);
        } else {
            const errorMessage = result.error.issues.pop()?.message ?? "Query가 유효하지 않습니다";
            throw new HttpError(errorMessage, 401);
        }


    }

    deleteProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        await this.#service.productService.deleteProduct(id);
        res.status(200).json();
    }
}