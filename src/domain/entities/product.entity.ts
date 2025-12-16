import { ID, TimestampFields } from "../../common/types/common";

export class Product implements TimestampFields {
  id: ID;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: ID;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: ID;
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    userId: ID;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.tags = data.tags;
    this.images = data.images;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  isOwnedBy(userId: ID): boolean {
    return this.userId === userId;
  }

  canBeModifiedBy(userId: ID): boolean {
    return this.isOwnedBy(userId);
  }

  canBeDeletedBy(userId: ID): boolean {
    return this.isOwnedBy(userId);
  }

  isPriceChanged(newPrice: number): boolean {
    return this.price !== newPrice;
  }

  getPriceChangePercentage(newPrice: number): number {
    if (this.price === 0) return 0;
    return ((newPrice - this.price) / this.price) * 100;
  }

  getPriceChangeDelta(newPrice: number): number {
    return newPrice - this.price;
  }

  update(data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string[];
    images?: string[];
  }): void {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.tags) this.tags = data.tags;
    if (data.images) this.images = data.images;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      tags: this.tags,
      images: this.images,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
