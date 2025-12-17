export type NewProductComment = Omit<
  ProductComment,
  "id" | "createdAt" | "updatedAt"
>;

export type PersistedProductComment = ProductComment & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

type ProductComment = {
  readonly id?: string;
  productId: string;
  content: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  userId: string;
};

export const ProductComment = {
  createNew: (params: {
    productId: string;
    content: string;
    userId: string;
  }) => {
    return {
      productId: params.productId,
      content: params.content,
      userId: params.userId,
    } as NewProductComment;
  },

  createPersist: (params: {
    id: string;
    productId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }) => {
    return {
      id: params.id,
      productId: params.productId,
      content: params.content,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
      userId: params.userId,
    } as PersistedProductComment;
  },
};
