import { BusinessException, BusinessExceptionType } from "../../../shared/exception/exception";


export type PersistedProduct = Product & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
};

export type NewProduct = Omit<
  PersistedProduct,
  "id" | "createdAt" | "updatedAt" | "likeCount"
>;

type Product = {
  readonly id?: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  userId: string;
  imageUrl?: string;
  readonly likeCount?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};

export const Product = {
  createNew: (params: {
    name: string;
    description: string;
    price: number;
    tags: string[];
    userId: string;
    imageUrl?: string;
  }) => {
    Product.validateDescription(params.description);
    Product.validatePrice(params.price);
    Product.validateTags(params.tags);
    return {
      name: params.name,
      description: params.description,
      price: params.price,
      tags: params.tags,
      userId: params.userId,
      imageUrl: params.imageUrl,
    } as NewProduct;
  },

  createPersist: (params: {
    id: string;
    name: string;
    description: string;
    price: number;
    tags: string[];
    userId: string;
    imageUrl?: string;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
  }) => {
    return {
      id: params.id,
      name: params.name,
      description: params.description,
      price: params.price,
      tags: params.tags,
      userId: params.userId,
      imageUrl: params.imageUrl,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      likeCount: params.likeCount,
    } as PersistedProduct;
  },

  validateDescription: (description: string) => {
    if (!description) {
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });
    };
  },

  validatePrice: (price: number) => {
    if (!price) {
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });
    }
  },

  validateTags: (tags: string[]) => {
    const allowedTags = [
      "Apparel",
      "Electronics",
      "HomeGoods",
      "LuxuryGoods",
      "Collectibles",
    ];
    if (!tags || !Array.isArray(tags) || tags.length === 0)
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });

    const invalidTags = tags.filter((tag) => !allowedTags.includes(tag));
    if (invalidTags.length > 0)
      throw BusinessException({
        type: BusinessExceptionType.PARSE_BODY_ERROR,
      });
  },
};
