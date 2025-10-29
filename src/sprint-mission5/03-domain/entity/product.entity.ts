import { EXCEPTIONS } from "../../common/const/exception.info";
import { Exception } from "../../common/exception/exception";
import { BaseEntity, BaseParams } from "./base.entity";

export interface ProductParams extends BaseParams<string> {
  userId: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  isLiked: boolean;
}

export type ProductFactoryType = {
  userId: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  isLiked: boolean;
}

export type CreateProductFactoryType = ProductFactoryType;

export type UpdateProductFactoryType = ProductFactoryType & {
  productId: string;
};

export class ProductEntity extends BaseEntity<string> {
  private _userId;
  private _name;
  private _description;
  private _price;
  private _tags;
  private _isLiked;

  constructor({
    id,
    userId,
    name,
    description,
    price,
    tags,
    isLiked,
    createdAt,
    updatedAt,
  }: ProductParams) {
    super({ id, createdAt, updatedAt });
    this._userId = userId;
    this._name = name;
    this._description = description;
    this._price = price;
    this._tags = tags;
    this._isLiked = isLiked;
  }

  static createFactory = ({ userId, name, description, price, tags, isLiked = false }: CreateProductFactoryType) => {
    this.validateNameRule(name);
    this.validateDescriptionRule(description);
    this.validatePriceIdRule(price);
    this.validateTagsIdRule(tags);
    return new ProductEntity({ userId, name, description, price, tags, isLiked });
  };

  static updateFactory = ({
    userId,
    productId: id,
    name,
    description,
    price,
    tags,
    isLiked = false,
  }: UpdateProductFactoryType) => {
    if (name !== undefined) {
      this.validateNameRule(name);
    }
    if (description !== undefined) {
      this.validateDescriptionRule(description);
    }
    if (price !== undefined) {
      this.validatePriceIdRule(price);
    }
    if (tags !== undefined) {
      this.validateTagsIdRule(tags);
    }
    return new ProductEntity({ userId, id, name, description, price, tags, isLiked });
  };

  static validateNameRule = (name: string) => {
    if (name.length > 20) {
      throw new Exception({ info: EXCEPTIONS.NAME_TOO_LONG });
    }
  };
  static validateDescriptionRule = (description: string) => {
    if (description.length < 5) {
      throw new Exception({ info: EXCEPTIONS.DESCRIPTION_TOO_SHORT });
    }
  };
  static validatePriceIdRule = (price: number) => {
    if (price < 0) {
      throw new Exception({ info: EXCEPTIONS.PRICE_NOT_NEGATIVE_NUMBER });
    }
  };
  static validateTagsIdRule = (tags: string[]) => {
    if (tags.length < 1) {
      throw new Exception({ info: EXCEPTIONS.LEAST_ONE_TAG });
    }
  };

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
  get userId() {
    return this._userId;
  }
  get isLiked() {
    return this._isLiked;
  }
}
