import axios from "axios"

export default class ArticleService {

    async getArticleList(page, pageSize, keyword="") {
        try {
            const response = await axios.get(`https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`)
            return response.data.list;
        } catch (e){ 
            if (e.response){
                console.log(e.response);
            } else {
                console.log("리퀘스트에 실패했습니다.");
            }
        }
    } // o


    async getArticle(articleId) {
        try {
            const response = await axios.get(`https://panda-market-api-crud.vercel.app/articles/${articleId}`)
            return response.data;
        } catch (e){ 
            if (e.response){
                console.log(e.response);
            } else {
                console.log("리퀘스트에 실패했습니다.");
            }
        }        
    } // o 



    async createArticle(article) {
        try {
            const response = await axios.post(`https://panda-market-api-crud.vercel.app/articles`, article)
            return response.data;
        } catch (e){ 
            if (e.response){
                console.log(e.response);
            } else {
                console.log("리퀘스트에 실패했습니다.");
            }
        }        
    } // o 



    async patchArticle(articleId, article) {
        try {
            const response = await axios.patch(`https://panda-market-api-crud.vercel.app/articles/${articleId}`, article);
            return response.data;
        } catch (e){ 
            if (e.response){
                console.log(e.response);
            } else {
                console.log("리퀘스트에 실패했습니다.");
            }
        }        
        
        
    } // o


    async deleteArticle(articleId) {
        try { 
            const response = await axios.delete(`https://panda-market-api-crud.vercel.app/articles/${articleId}`);
            return response.data;
        } catch (e) {
            if (e.response){
                console.log(e.response);
            } else {
                console.log("리퀘스트에 실패했습니다.");
            }
        }

    } // o
}


