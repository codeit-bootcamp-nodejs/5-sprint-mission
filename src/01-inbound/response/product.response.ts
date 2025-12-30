import { Product } from "@prisma/client";
import { PersistedProduct } from "../../02-application/command/entity/product";

export const ProductResDto = (entity: PersistedProduct) => {
  const { id, name, description, price, tags, createdAt, updatedAt, userId } =
    entity;

  return {
    id,
    name,
    description,
    price,
    tags,
    createdAt,
    updatedAt,
    userId,
  };
};
