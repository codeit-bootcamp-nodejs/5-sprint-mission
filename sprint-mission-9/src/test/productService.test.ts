import ForbiddenError from '../lib/errors/ForbiddenError'
import NotFoundError from '../lib/errors/NotFoundError'
import * as productsService from '../services/productsService'
import * as productsRepository from '../repositories/productsRepository'
import * as favoritesRepository from '../repositories/favoritesRepository'
import * as notificationsService from '../services/notificationsService'
import { NotificationType } from '../types/Notification'

jest.mock('../repositories/productsRepository')
jest.mock('../repositories/favoritesRepository')
jest.mock('../services/notificationsService')

const mockProductsRepo = productsRepository as jest.Mocked<typeof productsRepository>
const mockFavoritesRepo = favoritesRepository as jest.Mocked<typeof favoritesRepository>
const mockNotifications = notificationsService as jest.Mocked<typeof notificationsService>

const testProduct = {
  id: 1,
  name: '상품',
  description: '설명',
  price: 1000,
  tags: ['tag'],
  images: ['img.jpg'],
  userId: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeEach(() => {
  jest.resetAllMocks()
})

describe('createProduct', () => {
  it('리포지토리 반환값 확인(기본값 favoriteCount/isFavorited)', async () => {
    mockProductsRepo.createProduct.mockResolvedValue(testProduct)

    const result = await productsService.createProduct({
      name: testProduct.name,
      description: testProduct.description,
      price: testProduct.price,
      tags: testProduct.tags,
      images: testProduct.images,
      userId: testProduct.userId,
    })

    expect(result).toMatchObject({
      id: testProduct.id,
      favoriteCount: 0,
      isFavorited: false,
    })
    expect(mockProductsRepo.createProduct).toHaveBeenCalledTimes(1)
  })
})

describe('getProduct', () => {
  it('존재하지 않으면 NotFoundError', async () => {
    mockProductsRepo.getProductWithFavorites.mockResolvedValue(null)

    await expect(productsService.getProduct(1)).rejects.toBeInstanceOf(NotFoundError)
  })

  it('존재하면 값을 그대로 반환', async () => {
    const data = { ...testProduct, favoriteCount: 2, isFavorited: true }
    mockProductsRepo.getProductWithFavorites.mockResolvedValue(data as any)

    const result = await productsService.getProduct(testProduct.id)

    expect(result).toEqual(data)
  })
})

describe('updateProduct', () => {
  it('존재하지 않으면 NotFoundError', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(null)

    await expect(
      productsService.updateProduct(testProduct.id, { userId: testProduct.userId, price: 2000 }),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it('작성자가 아니면 ForbiddenError', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(testProduct as any)

    await expect(
      productsService.updateProduct(testProduct.id, { userId: 999, price: 2000 }),
    ).rejects.toBeInstanceOf(ForbiddenError)
  })

  it('가격 변경 시 즐겨찾기 유저들에게 알림 생성', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(testProduct as any)
    mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
      ...testProduct,
      price: 2000,
      favoriteCount: 1,
      isFavorited: true,
    } as any)
    mockFavoritesRepo.getFavoritesByProductId.mockResolvedValue([
      { id: 1, productId: testProduct.id, userId: 200, createdAt: new Date(), updatedAt: new Date() },
    ] as any)

    const result = await productsService.updateProduct(testProduct.id, {
      userId: testProduct.userId,
      price: 2000,
    })

    expect(result.price).toBe(2000)
    expect(mockNotifications.createNotifications).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          userId: 200,
          type: NotificationType.PRICE_CHANGED,
          payload: { productId: testProduct.id, price: 2000 },
        }),
      ]),
    )
  })

  it('가격이 변하지 않으면 알림을 생성하지 않는다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(testProduct as any)
    mockProductsRepo.updateProductWithFavorites.mockResolvedValue({
      ...testProduct,
      favoriteCount: 0,
      isFavorited: false,
    } as any)

    await productsService.updateProduct(testProduct.id, {
      userId: testProduct.userId,
      price: testProduct.price,
    })

    expect(mockNotifications.createNotifications).not.toHaveBeenCalled()
  })
})

describe('deleteProduct', () => {
  it('존재하지 않으면 NotFoundError', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(null)

    await expect(productsService.deleteProduct(testProduct.id, testProduct.userId)).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it('소유자가 아니면 ForbiddenError', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(testProduct as any)

    await expect(productsService.deleteProduct(testProduct.id, 999)).rejects.toBeInstanceOf(ForbiddenError)
  })

  it('소유자는 삭제할 수 있다', async () => {
    mockProductsRepo.getProduct.mockResolvedValue(testProduct as any)

    await productsService.deleteProduct(testProduct.id, testProduct.userId)

    expect(mockProductsRepo.deleteProduct).toHaveBeenCalledWith(testProduct.id)
  })
})
