import { Exception } from "../../common/exception/exception.js"
import { BaseReqDto } from "./base.req.dto.js"


export class CommentReqDto extends BaseReqDto {
    content
    userId
    productId
    articleId

    constructor(request) {
        super(request)
        const { content } = this.body;
        this.content = content;
        this.userId = request.userId;
        this.productId = request.params.productId;
        this.articleId = request.params.articleId;
    }

    validate() {
        this.validateContent(this.content);
        return this;
    }


    validateContent(content) {
        if (!content) {
            throw new Exception("댓글 내용을 입력해주세요.", 400);
        }
    }
}