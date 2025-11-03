type ProductParams = {
  id?: number
  name: string;
  description: string;
  price: number;
  tags: string;
  images?: string[]
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  likedAt?: Date
}

export type PersistedProductEntity = ProductEntity & { id: number };

export type FavoriteProductWithLike = ProductEntity & { likedAt: Date }

export class ProductEntity {
  private _id?
  private _name
  private _description
  private _price
  private _tags
  private _images
  private _userId?
  private _createdAt?;
  private _updatedAt?;
  private _likedAt?

  constructor({ id, name, description, price,
    tags, images, userId, createdAt, updatedAt, likedAt
  }: ProductParams) {

    this._id = id
    this._name = name
    this._description = description
    this._price = price
    this._tags = tags
    this._images = images
    this._userId = userId
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._likedAt = likedAt
  }

 get id(): number | undefined {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get description(): string {
    return this._description
  }

  get price(): number {
    return this._price
  }

  get tags(): string {
    return this._tags
  }

  get images(): string[] | undefined {
    return this._images
  }

  get userId(): number | undefined {
    return this._userId
  }

  get createdAt(): Date | undefined {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  get likedAt(): Date | undefined {
    return this._likedAt
  }
}