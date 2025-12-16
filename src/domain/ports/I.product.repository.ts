import { Product } from "../entities/product.entity";
import { ID } from "../../common/types/common";

export interface IProductRepository {
  create(data: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    images: string[];
    userId: ID;
  }): Promise<Product>;

  findById(id: ID): Promise<Product | null>;

  findMany(query: {
    page: number;
    pageSize: number;
    keyword?: string;
    orderBy?: string;
  }): Promise<{ items: Product[]; total: number }>;

  update(
    id: ID,
    data: {
      name?: string;
      description?: string;
      price?: number;
      tags?: string[];
      images?: string[];
    },
  ): Promise<Product>;

  delete(id: ID): Promise<void>;

  countByUserId(userId: ID): Promise<number>;

  exists(id: ID): Promise<boolean>;

  findPriceHistoryById(
    id: ID,
    limit?: number,
  ): Promise<{ price: number; updatedAt: Date }[]>;
}
