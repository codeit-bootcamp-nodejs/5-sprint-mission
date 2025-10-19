import { Exception } from "../../common/const/exception.js";
import { BaseEntity } from "./baseEntity.js";

export class Product extends BaseEntity {
  #name;
  #description;
  #price;
  #tags;
  constructor({
    id = undefined,
    name = undefined,
    description = undefined,
    price = undefined,
    tags = undefined,
    createdAt = undefined,
    updatedAt = undefined,
  }) {
    super({ id, createdAt, updatedAt });
    this.#name = name;
    this.#description = description;
    this.#price = price;
    this.#tags = tags;
  }

  static createFactory = ({ name, description, price, tags }) => {
    this.validateNameRule(name);
    this.validateDescriptionRule(description);
    this.validatePriceIdRule(price);
    this.validateTagsIdRule(tags);
    return new Product({ name, description, price, tags });
  };

  static updateFactory = ({ id, name, description, price, tags }) => {
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

  static deleteFactory = ({ id, name }) => {
    if (name !== this.undefined) {
      this.validateNameRule(name);
    }
    return new Product({ id, name });
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
}
