export class UserLikesArticleEntity {
  private readonly _userId: string;
  private readonly _articleId: string;

  constructor(attributes: {
    userId: string;
    articleId: string;
  }) {
    this._userId = attributes.userId;
    this._articleId = attributes.articleId;
  }

  get userId() {
    return this._userId;
  }
  get articleId() {
    return this._articleId;
  }

  static createNew(params: {
    userId: string;
    articleId: string;
  }): UserLikesArticleEntity {
    return new UserLikesArticleEntity(params) as UserLikesArticleEntity;
  }
  static createPersist(params: {
    userId: string;
    articleId: string;
  }): UserLikesArticleEntity {
    return new UserLikesArticleEntity(params) as UserLikesArticleEntity;
  }
}