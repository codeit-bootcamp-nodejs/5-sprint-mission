import { EXCEPTIONS } from "../../shared/const/exception.info";
import { Exception } from "../../shared/exception/exception";
import { BaseEntity } from "./base.entity";

export type NewArticleEntity = Omit<
  ArticleEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  userId: string;
};

export interface PersistArticleEntity extends ArticleEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ArticleEntity extends BaseEntity<string> {
  private readonly _userId?: string;
  private _title: string;
  private _content: string;
  private _image?: string;

  constructor(attributes: {
    id?: string;
    userId?: string;
    title: string;
    content: string;
    image?: string;
    createdAt?: Date,
    updatedAt?: Date,
  }) {
    super(attributes.id, attributes.createdAt, attributes.updatedAt);
    this._userId = attributes.userId;
    this._title = attributes.title;
    this._content = attributes.content;
    this._image = attributes.image;
  }

  static createNew(params: {
    userId: string;
    title: string;
    content: string;
    image?: string;
  }): NewArticleEntity {
    this.validateTitleRule(params.title);
    this.validateContentRule(params.content);
    return new ArticleEntity(params) as NewArticleEntity;
  };

  static createPersist(params: {
    id: string;
    userId: string;
    title: string;
    content: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
  }): PersistArticleEntity {
    return new ArticleEntity(params) as PersistArticleEntity;
  };

  update(params: {
    title?: string,
    content?: string,
    image?: string,
  }): void {
    if (params.title) {
      ArticleEntity.validateTitleRule(params.title);
      this._title = params.title;
    }
    if (params.content) {
      ArticleEntity.validateContentRule(params.content);
      this._content = params.content;
    }
    if (params.image) {
      this._image = params.image;
    }
  };

  static validateTitleRule(title: string): void {
    if (title.length > 20) {
      throw new Exception({
        info: EXCEPTIONS.TITLE_TOO_LONG
      });
    }
  };
  static validateContentRule(content: string): void {
    if (content.length < 5) {
      throw new Exception({ info: EXCEPTIONS.CONTENT_TOO_SHORT });
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
  get image() {
    return this._image;
  }
}
