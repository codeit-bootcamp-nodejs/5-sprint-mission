import ArticleDTO from "../dto/article-dto.js"


export default class ArticleScreen {
    #articledemo
    
    constructor(articledemo){
        this.#articledemo = articledemo;
    }

    async demonstrate(){
            // ========== ARTICLE API ========== 
            // [GET] getArticleList() : 페이지 단위로 글 조회
            console.log("========== ARTICLE API ========== ");
            console.log("\n======== [GET] getArticleList() =====");

            const PAGE = 1;
            const itemCnt = 10;

            let response = await this.#articledemo.getArticleList(PAGE, itemCnt);
            console.log(response);



            // [POST] createArticle() : 글 작성 
            console.log("\n======== [POST] createArticle() =====");

            let image = "https://example.com/...";
            let title = "new title";
            let content = "new content";
            let createdArticle = null;

            ({response, createdArticle} = await this.#articledemo.createArticle(image, content, title));
            console.log(response);
            createdArticle.showInfo();



            // [GET] getArticle() : 글 ID로 조회 (작성한 글 조회)
            console.log("\n======== [GET] getArticle() =====");
            response = await this.#articledemo.getArticle(createdArticle.writer);
            console.log(response);



            // [PATCH] patchArticle() : 글 수정 (작성한 글 수정)
            let updatedArticle = null;

            console.log("\n======== [PATCH] patchArticle() =====");

            image = "http://example.com";
            title = "updated title"; 
            content = "updated content"; 

            ({ response, updatedArticle } = await this.#articledemo.patchArticle(createdArticle, image, content, title));
            console.log(response);
            updatedArticle.showInfo();



            // [DELETE] deleteArticle() : 글 삭제 (수정한 글 삭제)
            response = await this.#articledemo.deleteArticle(createdArticle.writer);
            console.log("\n======== [DELETE] deleteArticle() =====");
            console.log(response);
    }
}