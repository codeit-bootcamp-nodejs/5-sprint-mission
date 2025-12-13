import { EXCEPTIONS } from "../../../shared/const/exception.info";
import { Exception } from "../../../shared/exception/exception";
import { BaseEntity} from "../base.entity";
import { ProductImageEntity } from "./product-image.entity";
import { ProductTagVo } from "./product-tag.vo";

export type NewProductEntity = Omit<
  ProductEntity,
  "id" | "createdAt" | "updatedAt"
> & {
  userId: string;
};

export interface PersistProductEntity extends ProductEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductEntity extends BaseEntity<string> {
  private readonly _userId? : string;
  private _name : string;
  private _description : string;
  private _price : number;

  private _tags: ProductTagVo[]  | undefined;
  private _images: ProductImageEntity[]  | undefined;

  constructor(attributes: {
    id?: string;
    userId?: string;
    name: string;
    description: string;
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: ProductTagVo[];
    images?: ProductImageEntity[];
  }) {
    super(attributes.id, attributes.createdAt, attributes.updatedAt );
    this._userId = attributes.userId;
    this._name = attributes.name;
    this._description = attributes.description;
    this._price = attributes.price;
    this._tags = attributes.tags;
  }

  static createNew (params: {
    userId: string;
    name: string;
    description: string;
    price: number;
    tags: ProductTagVo[];
    images: ProductImageEntity[];
  }): NewProductEntity {
    this.validateNameRule(params.name);
    this.validateDescriptionRule(params.description);
    this.validatePriceIdRule(params.price);
    return new ProductEntity(params) as NewProductEntity;
  };

  static createPersist (params: {
    id: string;
    userId: string;
    name: string;
    description: string;
    price: number;
    tags: ProductTagVo[];
    images: ProductImageEntity[];
    createdAt: Date;
    updatedAt: Date;
  }): PersistProductEntity {
    return new ProductEntity(params) as PersistProductEntity;
  };

  update (params:{
    name?: string;
    description?: string;
    price?: number;
    tags?: ProductTagVo[];
    images?: ProductImageEntity[];
  }): void {
    if (params.name) {
      ProductEntity.validateNameRule(params.name);
      this._name = params.name;
    }
    if (params.description) {
      ProductEntity.validateDescriptionRule(params.description);
      this._description = params.description;
    }
    if (params.price) {
      ProductEntity.validatePriceIdRule(params.price);
      this._price = params.price;
    }
    if(params.tags){
      this._tags = params.tags;
    }
    if(params.images){
      this._images = params.images;
    }
  };

  static validateNameRule(name: string): void {
    if (name.length > 20) {
      throw new Exception({ info: EXCEPTIONS.NAME_TOO_LONG });
    }
  };
  static validateDescriptionRule(description: string) : void{
    if (description.length < 5) {
      throw new Exception({ info: EXCEPTIONS.DESCRIPTION_TOO_SHORT });
    }
  };
  static validatePriceIdRule(price: number): void {
    if (price < 0) {
      throw new Exception({ info: EXCEPTIONS.PRICE_NOT_NEGATIVE_NUMBER });
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
}
