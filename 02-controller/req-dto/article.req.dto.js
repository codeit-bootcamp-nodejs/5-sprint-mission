import { Exception } from "../../common/exception/exception.js"
import { BaseReqDto } from "./base.req.dto.js"


export class ArticleReqDto extends BaseReqDto {
    title
    content

    constructor(request) {
        super(request)
        const { title, content } = this.body;
        this.title = title;
        this.content = content;
    }

    validate() {
        this.validateTitle(this.title);
        this.validateContent(this.content);
        return this;
    }

    validateTitle(title) {
        if (!title) {
            throw new Exception("제목을 입력해주세요.", 400);
        }
    }

    validateContent(content) {
        if (!content) {
            throw new Exception("내용을 입력해주세요.", 400);
        }
    }
}