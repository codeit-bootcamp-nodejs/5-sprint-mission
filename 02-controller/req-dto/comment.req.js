import { Exception } from "../../common/exception/exception.js"
import { BaseReqDto } from "./base.req.dto.js"


export class CommentReqDto extends BaseReqDto {
    content

    constructor(request) {
        super(request)
        const { content } = this.body;
        this.content = content;
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