export type ArticleParams = {
  id?: number;
  title: string;
  content: string;
  images?: string[];
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  likedAt?: Date; 
}

export type PersistedArticleEntity = ArticleEntity & { id: number; userId: number; createdAt: Date; updatedAt: Date; };

export type FavoriteArticleWithLike = PersistedArticleEntity & { likedAt: Date };

export class ArticleEntity {
  private _id?: number;
  private _title: string;
  private _content: string;
  private _images?: string[];
  private _userId?: number;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _likedAt?: Date;

  constructor({ 
    id, 
    title, 
    content, 
    images, 
    userId, 
    createdAt, 
    updatedAt, 
    likedAt 
  }: ArticleParams) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._images = images;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._likedAt = likedAt;
  }

  get id(): number | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get images(): string[] | undefined {
    return this._images;
  }

  get userId(): number | undefined {
    return this._userId;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get likedAt(): Date | undefined {
    return this._likedAt;
  }
}
