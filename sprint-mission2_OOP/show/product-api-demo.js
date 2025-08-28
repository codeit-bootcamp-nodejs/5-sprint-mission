import ProductDTO from "../dto/product-dto.js"
import Product from "../entity/product.js";


export default class ProductDemo {

    #productservice

    constructor(productservice){
        this.#productservice = productservice;
    }

    async getProductList(page, cnt){
        const response = await this.#productservice.getProductList(page, cnt);
        return response;
    }


    async createProduct(images, tags, price, description, name){
        const newProduct = new ProductDTO(images, tags, price, description, name);
        const response = await this.#productservice.createProduct(newProduct);
        const createdProduct = new Product(response.name, response.description, response.price, response.tags, response.images);

        return { response, createdProduct };
    }

    async getProduct(productId){
        const response = await this.#productservice.getProduct(productId);
        return response;
    }

    async patchProduct(product, images, tags, price, description, name) {
        const newProduct = new ProductDTO(images, tags, price, description, name);
        const response = await this.#productservice.patchProduct(product.id, newProduct);
        const updatedProduct = new Product(response.name, response.description, response.price, response.tags, response.images);
        return { response , updatedProduct }; 
    }

    async deleteProduct(productId){
        const response = await this.#productservice.deleteProduct(productId); 
        return response;
    }

}



// // ========== PRODUCT API ==========
// console.log("========== PRODUCT API ========== ");


// // [GET] getProductList() : 페이지 단위로 상품 조회
// let response = await product.getProductList(1,10);

// console.log("\n======== [GET] getProductList() =====");
// console.log(response);



// // [POST] createProduct() : 새로운 상품 등록
// const newProduct1 = new ProductDTO("http://example.com", "전자기기", 500000, "게임기", "닌텐도 스위치");
// response = await product.createProduct(newProduct1);
// const createdProduct = new Product(response.name, response.description, response.price, response.tags, response.images);

// console.log("\n======== [POST] createProduct() =====");
// console.log(response);
// createdProduct.showInfo();


// // [GET] 
// product.getProduct()
