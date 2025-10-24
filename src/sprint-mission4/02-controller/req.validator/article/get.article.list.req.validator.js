import { Exception } from "../../../common/const/exception.js";
import { BaseValidator } from "../base.validator.js";

export class GetArticleListReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { offset = 1, limit = 5, sort = "recent" } = this.query;

    offset = Number(offset);
    limit = Number(limit);

    if (!this.isInt(offset) || offset < 0) {
      throw new Exception("OFFSET_FORM");
    }
    if (!this.isInt(limit) || this.isEmpty(limit) || limit <= 0) {
      throw new Exception("LIMIT_FORM");
    }

    if (!["recent", "titleAsc", "titleDesc"].includes(sort)) {
      throw new Exception("SORT_FORM");
    }
    return {
      offset,
      limit,
      sort,
    };
  }
}
