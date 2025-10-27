import * as s from "superstruct";

const CATEGORIES = [
  "Apparel",
  "Electronics",
  "Home_Goods",
  "Luxury_Goods",
  "Collectibles",
];

export const SignUp = s.object({
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: size(string(), 6, 100),
  nickname: size(string(), 1, 10),
});

export const LogIn = object({
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: size(string(), 6, 100),
});

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
