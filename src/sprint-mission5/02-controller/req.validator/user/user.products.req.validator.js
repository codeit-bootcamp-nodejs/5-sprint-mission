import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class UserProductsReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { offset = 0, limit = 3, sort = "recent" } = this.query;

    offset = Number(offset);
    limit = Number(limit);

    if (this.isEmpty(this.userId)) {
      throw new Exception("USERID_FORM");
    }
    if (!this.isInt(offset) || offset < 0) {
      throw new Exception("OFFSET_FORM");
    }
    if (!this.isInt(limit) || this.isEmpty(limit) || limit <= 0) {
      throw new Exception("LIMIT_FORM");
    }

    if (!["recent", "priceLowest", "priceHighest"].includes(sort)) {
      throw new Exception("SORT_FORM");
    }
    return {
      id: this.userId,
      offset,
      limit,
      sort,
    };
  }
}
