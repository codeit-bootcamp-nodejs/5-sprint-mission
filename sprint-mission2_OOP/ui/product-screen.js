export default class ProductScreen {
    #productdemo
    
    constructor(productdemo){
        this.#productdemo = productdemo;
    }


    async demonstrate(){
        // ========== PRODUCT API ==========
        console.log("\n\n\n\n========== PRODUCT API ========== ");



        // [GET] getProductList() : 페이지 단위로 상품 조회
        console.log("\n======== [GET] getProductList() =====");
        const page = 1;
        const itemCnt = 10;

        let response = await this.#productdemo.getProductList(page, itemCnt);
        console.log(response);



        // [POST] createProduct() : 새로운 상품 등록
        let createdProduct = null;
        console.log("\n======== [POST] createProduct() =====");
        
        let images = ["https://example.com"];
        let tags = ["전자기기"];
        let price = 500000;
        let description = "게임기"; 
        let name = "닌텐도 스위치";
        
        ({ response, createdProduct } = await this.#productdemo.createProduct(images, tags, price, description, name));
        console.log(response);
        createdProduct.showInfo();



        // [GET] getProduct() : productId로 상품조회
        console.log("\n======== [GET] getProduct() =====");
        response = await this.#productdemo.getProduct(response.id);
        console.log(response);


        
        // [PATCH] patchProduct() : productId에 해당하는 상품 수정
        console.log("\n======== [PATCH] getProduct() =====");

        let updatedProduct = null;
        images = ["https://example.com"];
        tags = ["전자기기"];
        price = 1000000;
        description = "노트북"; 
        name = "MSI GS Stealth66";

        ({response, updatedProduct} = await this.#productdemo.patchProduct(response, images, tags, price, description, name));
        console.log(response);
        updatedProduct.showInfo();


        
        // [DELETE] deleteProduct() : productId로 해당 상품 제거
        console.log("\n======== [DELETE] deleteProduct() =====");
        response = await this.#productdemo.deleteProduct(response.id);
        console.log(response);
    }
}