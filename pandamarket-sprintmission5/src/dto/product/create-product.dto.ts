interface IUploadProductDto {
  name: string;
  description: string;
  price: number;
  tags: $Enums.Tags;
  images?: string[];
  id?: number;
  userId: number;
}

import { $Enums } from "@prisma/client";

export class UploadProductDto {
  name;
  description;
  price;
  tags;
  images?;
  id?;
  userId;

  constructor({
    name,
    description,
    price,
    tags,
    images,
    id,
    userId,
  }: IUploadProductDto) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.id = id;
    this.userId = userId;
  }
}
