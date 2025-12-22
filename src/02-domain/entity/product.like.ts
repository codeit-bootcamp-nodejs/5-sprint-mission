export const ProductLike = (params: { userId: string; productId: string }) => {
  return {
    userId: params.userId,
    productId: params.productId,
  };
};

export type PersistedProductLike = ReturnType<typeof ProductLike>;
