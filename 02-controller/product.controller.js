import { BaseController } from "./base.controller.js";
import { ProductReqDto } from "./req-dto/product.req.dto.js";


export class ProductController extends BaseController {
    #service

    constructor(service) {
        super('/products');
        this.#service = service;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getProductsMiddleware);
        this.router.get('/:id', this.getProductMiddleware);
        this.router.post('/', this.createProductMiddleware);
        this.router.patch('/:id', this.updateProductMiddleware);
        this.router.delete('/:id', this.deleteProductMiddleware);
    }

    getProductsMiddleware = async (req, res) => {
        const query = req.query;
        const productsResDto = await this.#service.getAllProducts(query);
        return res.json(productsResDto);
    }

    getProductMiddleware = async (req, res) => {
        const id = req.params.id;
        const productResDto = await this.#service.getProduct(id);
        return res.json(productResDto);
    }

    createProductMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body }).validate();
        const newProductResDto = await this.#service.createProduct(productReqDto);

        return res.status(201).json(newProductResDto);
    }

    updateProductMiddleware = async (req, res) => {
        const productReqDto = new ProductReqDto({ body: req.body, params: req.params }).validate();
        const updatedProductResDto = await this.#service.updateProduct(productReqDto);

        res.status(200).json(updatedProductResDto);
    }

    deleteProductMiddleware = async (req, res) => {
        const id = req.params.id;
        await this.#service.deleteProduct(id);
        res.status(200).json();
    }
}