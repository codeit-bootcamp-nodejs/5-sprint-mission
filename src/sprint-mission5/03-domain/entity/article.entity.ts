import { EXCEPTIONS } from "../../common/const/exception.info.js";
import { Exception } from "../../common/exception/exception.js";
import { BaseEntity, BaseParams } from "./base.entity.js";

export interface ArticleParams extends BaseParams<string> {
  userId: string;
  title: string;
  content: string;
  isLiked: boolean;
}

export class ArticleEntity extends BaseEntity<string> {
  private _userId;
  private _title;
  private _content;
  private _isLiked;

  constructor({
    id,
    userId,
    title,
    content,
    isLiked = false,
    createdAt,
    updatedAt,
  }: ArticleParams) {
    super({ id, createdAt, updatedAt });
    this._userId = userId;
    this._title = title;
    this._content = content;
    this._isLiked = isLiked;
  }

  static createFactory = ({ userId, title, content, isLiked = false }: {
    userId : string,
    title: string,
    content: string,
    isLiked: boolean,
  }) => {
    this.validateTitleRule(title);
    this.validateContentRule(content);
    return new ArticleEntity({ userId, title, content, isLiked });
  };
  static updateFactory = ({ articleId: id, userId, title, content, isLiked = false }: {
    articleId : string,
    userId: string,
    title: string,
    content: string,
    isLiked: boolean,
  }) => {
    if (title !== undefined) {
      this.validateTitleRule(title);
    }
    if (content !== undefined) {
      this.validateContentRule(content);
    }
    return new ArticleEntity({ id, userId, title, content, isLiked });
  };

  static validateTitleRule = (title: string) => {
    if (title.length > 20) {
      throw new Exception({
        info: EXCEPTIONS.TITLE_TOO_LONG
      });
    }
  };
  static validateContentRule = (content: string) => {
    if (content.length < 5) {
      throw new Exception({info: EXCEPTIONS.CONTENT_TOO_SHORT});
    }
  };

  get userId() {
    return this._userId;
  }
  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  get isLiked() {
    return this._isLiked;
  }
}
