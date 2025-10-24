import { Exception } from "../../../../common/const/exception.js";
import { BaseValidator } from "../../base.validator.js";

export class UpdateArticleCommentReqValidator extends BaseValidator {
  constructor(data) {
    super(data);
  }

  validate() {
    const { content } = this.body;
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
    if (!this.isEmpty(content)) {
      if (!this.isString(content)) {
        throw new Exception("CONTENT_FORM");
      }
    }

    return {
      userId : this.userId,
      articleId,
      commentId,
      content,
    };
  }
}
