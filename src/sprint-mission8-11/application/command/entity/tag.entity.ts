import { BusinessExceptionType } from "../../../shared/const/business.exception.info";
import { BusinessException } from "../../../shared/exceptions/business.exception";
import { BaseEntity } from "./base.entity";

export type NewTagEntity = Omit<TagEntity, "id" | "createdAt" | "updatedAt">;

export interface PersistTagEntity extends TagEntity {
  id: number;
  createAt: Date;
}

export class TagEntity extends BaseEntity<number> {
  private readonly _name: string;

  constructor(attributes: { id?: number; name: string; createdAt?: Date }) {
    super(attributes.id, attributes.createdAt);
    this._name = attributes.name;
  }

  get name() {
    return this._name;
  }

  static createNew(params: { name: string }): NewTagEntity {
    if (params.name) {
      this.validateNameRule(params.name);
    }
    return new TagEntity(params) as NewTagEntity;
  }

  static createPersist(params: {
    id: number;
    name: string;
    createdAt: Date;
  }): PersistTagEntity {
    return new TagEntity(params) as PersistTagEntity;
  }

  static validateNameRule(name: string): void {
    if (name.length > 20) {
      throw new BusinessException({
        type: BusinessExceptionType.NAME_TOO_LONG,
      });
    }
  }
}
