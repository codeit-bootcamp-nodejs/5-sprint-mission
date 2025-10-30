import { BaseController } from "./base.controller.js";
import { ProductReqDto } from "./req-dto/product.req.dto.js";


export class ProductController extends BaseController {
    #service
    #auth

    constructor(service, auth) {
        super('/products');
        this.#service = service;
        this.#auth = auth;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getProductsMiddleware);
        this.router.get('/:id', this.getProductMiddleware);
        this.router.patch('/:id/likes', this.#auth.verifyAccessToken, this.likeProductMiddleware);
        this.router.post('/', this.#auth.verifyAccessToken, this.createProductMiddleware);
        this.router.patch('/:id', this.#auth.verifyAccessToken, this.#auth.verifyProductAuth, this.updateProductMiddleware);
        this.router.delete('/:id', this.#auth.verifyAccessToken, this.#auth.verifyProductAuth, this.deleteProductMiddleware);
    }

    likeProductMiddleware = async (req, res) => {
        const id = req.params.id;
        const product = await this.#service.product.likeProduct(id);
        return res.json(product);
    }

    getProductsMiddleware = async (req, res) => {
        const query = req.query;
        const productsResDto = await this.#service.product.getAllProducts(query);
        return res.json(productsResDto);
    }

    getProductMiddleware = async (req, res) => {
        const id = req.params.id;
        const productResDto = await this.#service.product.getProduct(id);
        return res.json(productResDto);
    }

    createProductMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body, userId: req.user.userId }).validate();
        const newProductResDto = await this.#service.product.createProduct(productReqDto);

        return res.status(201).json(newProductResDto);
    }

    updateProductMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body, params: req.params }).validate();
        const updatedProductResDto = await this.#service.product.updateProduct(productReqDto);

        res.status(200).json(updatedProductResDto);
    }

    deleteProductMiddleware = async (req, res) => {
        const id = req.params.id;
        await this.#service.product.deleteProduct(id);
        res.status(200).json();
    }
}