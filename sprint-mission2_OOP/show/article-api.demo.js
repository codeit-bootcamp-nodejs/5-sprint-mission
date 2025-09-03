import ArticleDTO from "../dto/article-dto.js";
import Article from "../entity/article.js"

export default class ArticleDemo {
    #articleservice

    constructor(articleservice) {
        this.#articleservice = articleservice;
    }

    async getArticleList(page, itemCnt){
        const response = await this.#articleservice.getArticleList(page, itemCnt);
        return response;
    }

    async createArticle(image, content, title){
        const newArticle = new ArticleDTO(image, content, title);

        const response = await this.#articleservice.createArticle(newArticle);
        const createdArticle = new Article(response.title, response.content, response.id);

        return { response, createdArticle };
    }

    async getArticle(articleId){
        const response = await this.#articleservice.getArticle(articleId);
        return response;
    }


    async patchArticle(article, image, content, title){ // dummy data 추가함
        const newArticle = new ArticleDTO(image, content, title); 
        const response = await this.#articleservice.patchArticle(article.writer, newArticle);
        const updatedArticle = new Article(response.title, response.content, response.id);

        return {response, updatedArticle};
    }

    async deleteArticle(articleId){
        const response = await this.#articleservice.deleteArticle(articleId);
        return response;
    }

}