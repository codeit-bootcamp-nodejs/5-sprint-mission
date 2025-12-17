import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import { getFavoritesByProductId } from '../repositories/favoritesRepository';
import * as productsRepository from '../repositories/productsRepository';
import { NotificationType } from '../types/Notification';
import { PagePaginationParams, PagePaginationResult } from '../types/pagination';
import Product from '../types/Product';
import { createNotifications } from './notificationsService';

type CreateProductData = Omit<
  Product,
  'id' | 'createdAt' | 'updatedAt' | 'favoriteCount' | 'isFavorited'
>;
type UpdateProductData = Partial<CreateProductData> & { userId: number };

export async function createProduct(data: CreateProductData): Promise<Product> {
  const createdProduct = await productsRepository.createProduct(data);
  return {
    ...createdProduct,
    favoriteCount: 0,
    isFavorited: false,
  };
}

export async function getProduct(id: number): Promise<Product | null> {
  const product = await productsRepository.getProductWithFavorites(id);
  if (!product) {
    throw new NotFoundError('product', id);
  }
  return product;
}

export async function getProductList(
  params: PagePaginationParams,
  { userId }: { userId?: number } = {},
): Promise<PagePaginationResult<Product>> {
  const products = await productsRepository.getProductListWithFavorites(params, { userId });
  return products;
}

export async function updateProduct(id: number, data: UpdateProductData): Promise<Product> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== data.userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  const updatedProduct = await productsRepository.updateProductWithFavorites(id, data);

  const beforePrice = existingProduct.price;
  const afterPrice = updatedProduct.price;

  if (beforePrice !== afterPrice) {
    const favorites = await getFavoritesByProductId(id);
    const likeUserIds = favorites.map((favorite) => favorite.userId);
    const notifications = likeUserIds.map((userId) => {
      return {
        userId,
        type: NotificationType.PRICE_CHANGED,
        payload: {
          productId: id,
          price: afterPrice,
        },
      };
    });

    await createNotifications(notifications);
  }
  return updatedProduct;
}

export async function deleteProduct(id: number, userId: number): Promise<void> {
  const existingProduct = await productsRepository.getProduct(id);
  if (!existingProduct) {
    throw new NotFoundError('product', id);
  }
  if (existingProduct.userId !== userId) {
    throw new ForbiddenError('Should be the owner of the product');
  }
  await productsRepository.deleteProduct(id);
}
