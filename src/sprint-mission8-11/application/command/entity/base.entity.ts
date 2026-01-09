export class BaseEntity<T = undefined> {
  private readonly _id?;
  private readonly _createdAt?;
  private readonly _updatedAt?;

  constructor(id?: T, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): T | undefined {
    return this._id;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
