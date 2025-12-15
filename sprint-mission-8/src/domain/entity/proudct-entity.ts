type ProductAttrs = {
  id?: number;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description: string;
  price: number;
  tags: string[];
  image?: string | null;
};

export type NewProductAttrs = Pick<
  ProductAttrs,
  "name" | "description" | "price" | "tags" | "image"
>;

export type EditProductAttrs = Partial<
  Pick<ProductAttrs, "name" | "description" | "price" | "tags" | "image">
>;

export type PersistedProductRecord = Required<
  Pick<ProductAttrs, "id" | "userId" | "createdAt" | "updatedAt">
> &
  Pick<ProductAttrs, "name" | "description" | "price" | "tags" | "image">;

export type PersistedProductEntity = ProductEntity;

export class ProductEntity {
  private readonly _id?: number;
  private readonly _userId?: number;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private _name: string;
  private _description: string;
  private _price: number;
  private _tags: string[];
  private _image?: string | null;

  constructor(attrs: ProductAttrs) {
    this._id = attrs.id;
    this._userId = attrs.userId;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
    this._name = attrs.name;
    this._description = attrs.description;
    this._price = attrs.price;
    this._tags = attrs.tags;
    this._image = attrs.image;
  }

  static createNew(
    attrs: NewProductAttrs & { userId?: number },
  ): ProductEntity {
    return new ProductEntity(attrs);
  }

  static fromPersisted(record: PersistedProductRecord): ProductEntity {
    return new ProductEntity(record);
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get price() {
    return this._price;
  }

  get tags() {
    return this._tags;
  }

  get image() {
    return this._image;
  }
}
