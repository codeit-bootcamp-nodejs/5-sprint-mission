
import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class DeleteArticleCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { articleId } = this.params;
    let { commentId } = this.params;
    commentId = Number(commentId);

    if (this.isEmpty(this.userId)) {      
      throw new Exception("USERID_FORM");
    }
    if (this.isEmpty(articleId)) {
      throw new Exception("ARTICLEID_FORM");
    }
    if (this.isEmpty(commentId)) {
      throw new Exception("COMMENTID_FORM");
    }

    return {
      userId : this.userId,
      articleId,
      commentId,
    };
  }
}
