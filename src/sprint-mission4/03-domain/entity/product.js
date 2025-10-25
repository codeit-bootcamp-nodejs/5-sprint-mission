import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Product extends BaseEntity {
  #userId;
  #name;
  #description;
  #price;
  #tags;
  #isLiked;

  constructor({
    id,
    userId,
    name = undefined,
    description = undefined,
    price = undefined,
    tags = undefined,
    isLiked = false,
    createdAt = undefined,
    updatedAt = undefined,
  }) {
    super({ id, createdAt, updatedAt });
    this.#userId = userId;
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
    this.#isLiked = isLiked;
  }

  static createFactory = ({ userId, name, description, price, tags }) => {
    this.validateNameRule(name);
    this.validateDescriptionRule(description);
    this.validatePriceIdRule(price);
    this.validateTagsIdRule(tags);
    return new Product({ userId, name, description, price, tags });
  };

  static updateFactory = ({
    productId: id,
    name,
    description,
    price,
    tags,
  }) => {
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
    return new Product({ id, name, description, price, tags });
  };

  static validateNameRule = (name) => {
    if (name.length > 20) {
      throw new Exception("NAME_TOO_LONG");
    }
  };
  static validateDescriptionRule = (description) => {
    if (description.length < 5) {
      throw new Exception("DESCRIPTION_TOO_SHORT");
    }
  };
  static validatePriceIdRule = (price) => {
    if (price < 0) {
      throw new Exception("PRICE_NOT_NEGATIVE_NUMBER");
    }
  };
  static validateTagsIdRule = (tags) => {
    if (tags.length < 1) {
      throw new Exception("LEAST_ONE_TAG");
    }
  };

  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get price() {
    return this.#price;
  }
  get tags() {
    return this.#tags;
  }
  get userId() {
    return this.#userId;
  }
  get isLiked() {
    return this.#isLiked;
  }
}
