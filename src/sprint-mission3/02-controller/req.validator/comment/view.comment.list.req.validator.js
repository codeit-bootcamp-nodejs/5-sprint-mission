import { Exception } from "../../../common/exception.js";
import { BaseValidator } from "../base.validator.js";

export class ViewCommentListReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { cursor = 0, limit = 5, sort = "recent" } = this.query;

    cursor = Number(cursor);
    limit = Number(limit);

    if (!this.isInt(cursor)) {
      throw new Exception("OFFSET_FORM");
    }
    if (!this.isInt(limit) || this.isEmpty(limit) || limit <= 0) {
      throw new Exception("LIMIT_FORM");
    }

    if (!["recent", "commentAsc"].includes(sort)) {
      throw new Exception("SORT_FORM");
    }
    return {
      cursor,
      limit,
      sort,
    };
  }
}
