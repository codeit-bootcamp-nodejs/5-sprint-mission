import * as struct from "superstruct";

const Tags = [
  "FASHION",
  "BEAUTY",
  "SPORTS",
  "ELECTRONICS",
  "HOME_INTERIOR",
  "HOUSEHOLD_SUPPLIES",
  "KITCHENWARE",
];

export const CreateProduct = struct.object({
  name: struct.size(struct.string(), 1, 50),
  description: struct.optional(struct.string()),
  tags: struct.enums(Tags),
  price: struct.min(struct.number(), 0),
});

export const PatchProduct = struct.partial(CreateProduct);

export const CreateArticle = struct.object({
  title: struct.size(struct.string(), 1, 50),
  content: struct.string(),
});

export const PatchArticle = struct.partial(CreateArticle);

export const CreateComment = struct.object({
  content: struct.string(),
});

export const PatchComment = struct.partial(CreateComment);
