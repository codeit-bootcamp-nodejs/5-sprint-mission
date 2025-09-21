import { Exception } from "../../common/exception/exception.js"
import { BaseReqDto } from "./base.req.dto.js"


export class ProductReqDto extends BaseReqDto {
    name
    description
    price
    tags

    constructor(request) {
        super(request)

        const { name, description, price, tags } = this.body;

        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
    }

    validate() {
        this.validateName(this.name);
        this.validateDescription(this.description);
        this.validatePrice(this.price);
        this.validateTags(this.tags);
        return this;
    }

    validateName(name) {
        if (!name) {
            throw new Exception("상품명을 입력해주세요.", 400);
        }
    }

    validateDescription(description) {
        if (!description) {
            throw new Exception("상품 상세설명을 입력해주세요.", 400);
        }
    }

    validatePrice(price) {
        if (!price) {
            throw new Exception("가격을 입력해주세요.", 400);
        }
    }

    validateTags(tags) {
        if (!tags) {
            throw new Exception("태그를 입력해주세요.", 400);
        }
    }

}