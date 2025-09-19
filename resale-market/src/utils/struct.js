import * as s from "superstruct";

const CATEGORIES = [
  "Apparel",
  "Electronics",
  "Home_Goods",
  "Luxury_Goods",
  "Collectibles",
];

export const CreateProduct = s.object({
  name: s.nonempty(s.string()),
  description: s.nonempty(s.string()),
  price: s.min(s.number(), 0),
  tags: s.enums(CATEGORIES),
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.nonempty(s.string()),
  content: s.nonempty(s.string()),
});

export const PatchArticle = s.partial(CreateArticle);

export const CreateComment = s.object({
  content: s.nonempty(s.string()),
});

export const PatchComment = s.partial(CreateComment);
