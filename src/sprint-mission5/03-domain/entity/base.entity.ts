export interface BaseParams<T> {
  id?: T;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BaseEntity<T> {
  private _id;
  private _createdAt;
  private _updatedAt;

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
