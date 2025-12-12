export interface BaseParams<T> {
  id?: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BaseEntity<T> {
  private readonly _id;
  private readonly _createdAt;
  private readonly _updatedAt;

  constructor({
    id,
    createdAt,
    updatedAt,
  }: BaseParams<T>) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id() : T | undefined {
    return this._id;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
