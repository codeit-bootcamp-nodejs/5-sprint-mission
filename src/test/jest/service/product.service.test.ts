
import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";

import { BusinessExceptionType } from "../../../shared/exception/exception";
import { NotificationType } from "@prisma/client";
import { INotificationCommandRepository } from "../../../02-application/port/repositories/command/I.notification.repository";
import { IProductLikeCommandRepository } from "../../../02-application/port/repositories/command/I.product.like.repository";
import { IProductCommandRepository } from "../../../02-application/port/repositories/command/I.product.repository";
import { PersistedNotification } from "../../../02-application/command/entity/notification";
import { PersistedProduct } from "../../../02-application/command/entity/product";
import { PersistedProductLike } from "../../../02-application/command/entity/product.like";
import { createProductCommandService, ProductCommandServiceType } from "../../../02-application/command/service/product.command.service";
import { createProductQueryService, ProductQueryServiceType } from "../../../02-application/query/service/product.query.service";
import { IProductQueryRepository } from "../../../02-application/port/repositories/query/I.product.query.repository";
import { IRedisExternal } from "../../../02-application/port/externals/I.redis.external";

describe("Product Service 단위 테스트", () => {
    let mockRedisExternal: IRedisExternal;
    let mockProductRepo: IProductCommandRepository;
    let mockProductLikeRepo: IProductLikeCommandRepository;
    let mockNotificationRepo: INotificationCommandRepository;
    let mockProductQueryRepo: IProductQueryRepository;
    let mockNotificationEventBus: INotificationEventBus;
    let productCommandService: ProductCommandServiceType;
    let productQueryService: ProductQueryServiceType;


    beforeEach(() => {
        mockRedisExternal = {
            set: jest.fn(),
            setIfNotExist: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        }


        // Mock Repositories
        mockProductRepo = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            update: jest.fn(),
            removeById: jest.fn(),
        };

        mockProductLikeRepo = {
            toggle: jest.fn(),
            findAll: jest.fn(),
        };

        mockNotificationRepo = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            removeAll: jest.fn(),
            remove: jest.fn()
        };

        mockProductQueryRepo = {
            findAll: jest.fn(),
            findById: jest.fn()

        }


        // Mock EventBus
        mockNotificationEventBus = {
            subscribe: jest.fn(),
            publish: jest.fn(),
            subscribeAll: jest.fn(),
            publishAll: jest.fn(),
        };

        // Create Service
        productCommandService = createProductCommandService(
            mockProductRepo,
            mockProductLikeRepo,
            mockNotificationRepo,
            mockNotificationEventBus,
        );

        productQueryService = createProductQueryService(
            mockRedisExternal,
            mockProductQueryRepo
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("상품 생성 (createProduct)", () => {
        const createDto = {
            name: "테스트 상품",
            description: "테스트 상품 설명",
            price: 10000,
            tags: ["Electronics"],
            userId: "user-123",
            imageUrl: "https://example.com/image.jpg",
        };

        test("새 상품을 성공적으로 생성하고 알림을 발행해야 합니다", async () => {
            // Given
            const mockSavedProduct: PersistedProduct = {
                id: "product-123",
                name: createDto.name,
                description: createDto.description,
                price: createDto.price,
                tags: createDto.tags,
                userId: createDto.userId,
                imageUrl: createDto.imageUrl,
                likeCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockNotification: PersistedNotification = {
                id: "notification-123",
                type: NotificationType.NEW_PRODUCT,
                message: "새로운 상품이 등록되었습니다!",
                read: false,
                senderId: createDto.userId,
                receiverId: undefined,
                createdAt: new Date(),
            };

            (mockProductRepo.save as jest.Mock).mockResolvedValue(mockSavedProduct);
            (mockNotificationRepo.create as jest.Mock).mockResolvedValue(mockNotification);

            // Spy on eventBus.publishAll
            const spyPublishAll = jest.spyOn(mockNotificationEventBus, 'publishAll');

            // When
            const result = await productCommandService.createProduct(createDto);

            // Then
            expect(mockProductRepo.save).toHaveBeenCalledWith({
                name: createDto.name,
                description: createDto.description,
                price: createDto.price,
                tags: createDto.tags,
                userId: createDto.userId,
                imageUrl: createDto.imageUrl,
            });
            expect(mockNotificationRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: NotificationType.NEW_PRODUCT,
                    message: "새로운 상품이 등록되었습니다!",
                    senderId: createDto.userId,
                })
            );
            expect(spyPublishAll).toHaveBeenCalledWith(mockNotification);
            expect(spyPublishAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expect.objectContaining({
                id: mockSavedProduct.id,
                name: mockSavedProduct.name,
                price: mockSavedProduct.price,
            }));
        });

        // ...existing code...
    });

    describe("상품 목록 조회 (getAllProducts)", () => {
        test("쿼리 조건에 맞는 상품 목록을 반환해야 합니다", async () => {
            // Given
            const query = { offset: 0, limit: 10, search: "", sort: "desc" as const };
            const mockProducts: PersistedProduct[] = [
                {
                    id: "product-1",
                    name: "상품 1",
                    description: "설명 1",
                    price: 10000,
                    tags: ["Electronics"],
                    userId: "user-1",
                    imageUrl: undefined,
                    likeCount: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "product-2",
                    name: "상품 2",
                    description: "설명 2",
                    price: 20000,
                    tags: ["HomeGoods"],
                    userId: "user-2",
                    imageUrl: undefined,
                    likeCount: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            (mockProductQueryRepo.findAll as jest.Mock).mockResolvedValue(mockProducts);

            // Spy on findAll
            const spyFindAll = jest.spyOn(mockProductQueryRepo, 'findAll');

            // When
            const result = await productQueryService.getAllProducts(query);

            // Then
            expect(spyFindAll).toHaveBeenCalledWith(query);
            expect(spyFindAll).toHaveBeenCalledTimes(1);
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe("product-1");
            expect(result[1].id).toBe("product-2");
        });

        // ...existing code...
    });

    describe("상품 단건 조회 (getProduct)", () => {
        test("ID로 상품을 성공적으로 조회해야 합니다", async () => {
            // Given
            const productId = "product-123";
            const mockProduct: PersistedProduct = {
                id: productId,
                name: "테스트 상품",
                description: "테스트 설명",
                price: 15000,
                tags: ["Electronics"],
                userId: "user-123",
                imageUrl: undefined,
                likeCount: 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (mockProductQueryRepo.findById as jest.Mock).mockResolvedValue(mockProduct);

            // Spy on findById
            const spyFindById = jest.spyOn(mockProductQueryRepo, 'findById');

            // When
            const result = await productQueryService.getProduct(productId);

            // Then
            expect(spyFindById).toHaveBeenCalledWith(productId);
            expect(spyFindById).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expect.objectContaining({
                id: mockProduct.id,
                name: mockProduct.name,
                price: mockProduct.price,
            }));
        });

        // ...existing code...
    });

    describe("상품 수정 (updateProduct)", () => {
        const updateDto = {
            id: "product-123",
            name: "수정된 상품",
            description: "수정된 설명",
            price: 25000,
            tags: ["LuxuryGoods"],
            userId: "user-123",
        };

        test("작성자 본인이면 상품을 성공적으로 수정해야 합니다 (가격 변경 없음)", async () => {
            // Given
            const existingProduct: PersistedProduct = {
                id: updateDto.id,
                name: "원본 상품",
                description: "원본 설명",
                price: 25000,
                tags: ["Electronics"],
                userId: updateDto.userId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedProduct: PersistedProduct = {
                ...existingProduct,
                name: updateDto.name,
                description: updateDto.description,
                tags: updateDto.tags,
                updatedAt: new Date(),
            };

            (mockProductRepo.findById as jest.Mock).mockResolvedValue(existingProduct);
            (mockProductRepo.update as jest.Mock).mockResolvedValue(updatedProduct);
            (mockProductLikeRepo.findAll as jest.Mock).mockResolvedValue([]);

            // Spy on findById and update
            const spyFindById = jest.spyOn(mockProductRepo, 'findById');
            const spyUpdate = jest.spyOn(mockProductRepo, 'update');

            // When
            const result = await productCommandService.updateProduct(updateDto);

            // Then
            expect(spyFindById).toHaveBeenCalledWith(updateDto.id);
            expect(spyUpdate).toHaveBeenCalled();
            expect(spyUpdate).toHaveBeenCalledTimes(1);
            expect(result.name).toBe(updateDto.name);
            expect(mockNotificationEventBus.publish).not.toHaveBeenCalled();
        });

        test("가격 변경 시 좋아요 누른 유저에게 알림을 전송해야 합니다", async () => {
            // Given
            const existingProduct: PersistedProduct = {
                id: updateDto.id,
                name: "원본 상품",
                description: "원본 설명",
                price: 20000,
                tags: ["Electronics"],
                userId: updateDto.userId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedProduct: PersistedProduct = {
                ...existingProduct,
                name: updateDto.name,
                description: updateDto.description,
                price: 25000,
                tags: updateDto.tags,
                updatedAt: new Date(),
            };

            const productLikes: PersistedProductLike[] = [
                { userId: "other-user-1", productId: updateDto.id },
                { userId: "other-user-2", productId: updateDto.id },
                { userId: updateDto.userId, productId: updateDto.id },
            ];

            const mockNotification: PersistedNotification = {
                id: "notification-123",
                type: NotificationType.PRODUCT_PRICE_CHANGE,
                message: "가격이 변동되었습니다. (20000 -> 25000)",
                read: false,
                senderId: updateDto.userId,
                receiverId: "other-user-1",
                createdAt: new Date(),
            };

            (mockProductRepo.findById as jest.Mock).mockResolvedValue(existingProduct);
            (mockProductRepo.update as jest.Mock).mockResolvedValue(updatedProduct);
            (mockProductLikeRepo.findAll as jest.Mock).mockResolvedValue(productLikes);
            (mockNotificationRepo.create as jest.Mock).mockResolvedValue(mockNotification);

            // Spy on findAll and create
            const spyFindAll = jest.spyOn(mockProductLikeRepo, 'findAll');
            const spyCreate = jest.spyOn(mockNotificationRepo, 'create');
            const spyPublish = jest.spyOn(mockNotificationEventBus, 'publish');

            // When
            const result = await productCommandService.updateProduct(updateDto);

            // Then
            expect(spyFindAll).toHaveBeenCalledWith(updateDto.id);
            expect(spyCreate).toHaveBeenCalledTimes(2);
            expect(spyPublish).toHaveBeenCalledTimes(2);
            expect(result.price).toBe(25000);
        });

        // ...existing code...
    });

    describe("상품 삭제 (deleteProduct)", () => {
        const productId = "product-123";
        const userId = "user-123";

        test("작성자 본인이면 상품을 성공적으로 삭제해야 합니다", async () => {
            // Given
            const existingProduct: PersistedProduct = {
                id: productId,
                name: "테스트 상품",
                description: "테스트 설명",
                price: 10000,
                tags: ["Electronics"],
                userId: userId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            (mockProductRepo.findById as jest.Mock).mockResolvedValue(existingProduct);
            (mockProductRepo.removeById as jest.Mock).mockResolvedValue(undefined);

            // Spy on findById and removeById
            const spyFindById = jest.spyOn(mockProductRepo, 'findById');
            const spyRemoveById = jest.spyOn(mockProductRepo, 'removeById');

            // When
            await productCommandService.deleteProduct(productId, userId);

            // Then
            expect(spyFindById).toHaveBeenCalledWith(productId);
            expect(spyRemoveById).toHaveBeenCalledWith(productId);
            expect(spyRemoveById).toHaveBeenCalledTimes(1);
        });

        // ...existing code...
    });

    describe("상품 좋아요 (likeProduct)", () => {
        const userId = "user-123";
        const productId = "product-456";
        const productOwnerId = "owner-789";

        test("다른 사람의 상품에 좋아요를 누르면 알림을 전송해야 합니다", async () => {
            // Given
            const mockProduct: PersistedProduct = {
                id: productId,
                name: "테스트 상품",
                description: "테스트 설명",
                price: 10000,
                tags: ["Electronics"],
                userId: productOwnerId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockProductLike: PersistedProductLike = {
                userId: userId,
                productId: productId,
            };

            const mockNotification: PersistedNotification = {
                id: "notification-123",
                type: NotificationType.PRODUCT_LIKE,
                message: `${userId}님이 좋아요를 눌렀습니다!`,
                read: false,
                senderId: userId,
                receiverId: productOwnerId,
                createdAt: new Date(),
            };

            (mockProductRepo.findById as jest.Mock).mockResolvedValue(mockProduct);
            (mockProductLikeRepo.toggle as jest.Mock).mockResolvedValue(mockProductLike);
            (mockNotificationRepo.create as jest.Mock).mockResolvedValue(mockNotification);

            // Spy on toggle, create, and publish
            const spyToggle = jest.spyOn(mockProductLikeRepo, 'toggle');
            const spyCreate = jest.spyOn(mockNotificationRepo, 'create');
            const spyPublish = jest.spyOn(mockNotificationEventBus, 'publish');

            // When
            const result = await productCommandService.likeProduct(userId, productId);

            // Then
            expect(spyToggle).toHaveBeenCalledWith(userId, productId);
            expect(spyCreate).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: NotificationType.PRODUCT_LIKE,
                    senderId: userId,
                    receiverId: productOwnerId,
                })
            );
            expect(spyPublish).toHaveBeenCalledWith(mockNotification);
            expect(spyPublish).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
        });

        test("자신의 상품에 좋아요를 누르면 알림을 전송하지 않아야 합니다", async () => {
            // Given
            const mockProduct: PersistedProduct = {
                id: productId,
                name: "테스트 상품",
                description: "테스트 설명",
                price: 10000,
                tags: ["Electronics"],
                userId: userId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockProductLike: PersistedProductLike = {
                userId: userId,
                productId: productId,
            };

            (mockProductRepo.findById as jest.Mock).mockResolvedValue(mockProduct);
            (mockProductLikeRepo.toggle as jest.Mock).mockResolvedValue(mockProductLike);

            // Spy on toggle and create
            const spyToggle = jest.spyOn(mockProductLikeRepo, 'toggle');
            const spyCreate = jest.spyOn(mockNotificationRepo, 'create');

            // When
            const result = await productCommandService.likeProduct(userId, productId);

            // Then
            expect(spyToggle).toHaveBeenCalledWith(userId, productId);
            expect(spyCreate).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        test("좋아요 취소 시 알림을 전송하지 않아야 합니다", async () => {
            // Given
            const mockProduct: PersistedProduct = {
                id: productId,
                name: "테스트 상품",
                description: "테스트 설명",
                price: 10000,
                tags: ["Electronics"],
                userId: productOwnerId,
                imageUrl: undefined,
                likeCount: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            (mockProductRepo.findById as jest.Mock).mockResolvedValue(mockProduct);
            (mockProductLikeRepo.toggle as jest.Mock).mockResolvedValue(null);

            // Spy on toggle and create
            const spyToggle = jest.spyOn(mockProductLikeRepo, 'toggle');
            const spyCreate = jest.spyOn(mockNotificationRepo, 'create');

            // When
            const result = await productCommandService.likeProduct(userId, productId);

            // Then
            expect(spyToggle).toHaveBeenCalledWith(userId, productId);
            expect(spyCreate).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        // ...existing code...
    });
});

