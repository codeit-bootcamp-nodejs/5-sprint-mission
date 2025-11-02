import { $Enums } from "@prisma/client";

interface IEditProductDto {
  name: string;
  description: string;
  price: number;
  tags: $Enums.Tags;
  images?: string[];
}

export class EditProductDto {
  name;
  description;
  price;
  tags;
  images;
  constructor({ name, description, price, tags, images }: IEditProductDto) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
  }
}
