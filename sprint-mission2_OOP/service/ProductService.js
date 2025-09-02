import axios from "axios"


export default class ProductService { 
    async getProductList(page, pageSize, keyword="") {
        try {
            const response = await axios.get(`https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`);
            return response.data.list;
        } catch (e){ 
            return e;
        }
    } // o

    async getProduct(productId) {
        try {
            const response = await axios.get(`https://panda-market-api-crud.vercel.app/products/${productId}`);
            return response.data;
        } catch (e){
            return e;
        }
    } // o 



    async createProduct(product) {
        try {
            const response = await axios.post(
                `https://panda-market-api-crud.vercel.app/products`,
                product,
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (e) {
            console.error("❌ Error response:", e.response?.data);
            console.error("❌ Error status:", e.response?.status);
            console.error("❌ Sent payload:", product);
            return e;
        }
    }



    async patchProduct(productId, product) {
        try { 
            const response = await axios.patch(`https://panda-market-api-crud.vercel.app/products/${productId}`, product);
            return response.data;
        } catch (e) {
            return e;
        }
    } // o


    async deleteProduct(productId) {
        try {
            const response = await axios.delete(`https://panda-market-api-crud.vercel.app/products/${productId}`);
            return response.data;
        } catch (e) { 
            return e;
        }
    } // o
}



