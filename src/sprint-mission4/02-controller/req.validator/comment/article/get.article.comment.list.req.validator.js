import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class GeteArticleCommentListReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    let { cursor = 0, limit = 3, sort = "recent" } = this.query;
    const { articleId } = this.params;

    cursor = Number(cursor);
    limit = Number(limit);

    if (this.isEmpty(articleId)) {
      throw new Exception("ARTICLEID_FORM");
    }
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
      articleId,
    };
  }
}
