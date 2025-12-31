import { UserLikesProductEntity } from "../../domain/entity/like/user-likes-product.entity";
import {
  PersistProductEntity,
  ProductEntity,
  NewProductEntity,
} from "../../domain/entity/product/product.entity";
import {
  TagEntity,
  NewTagEntity,
  PersistTagEntity,
} from "../../domain/entity/tag.entity";
import { IUserLikesProductRepo } from "../../domain/port/repo/like/user-likes-product.repo.interface";
import { INotificationRepo } from "../../domain/port/repo/notification.repo.interface";
import { IProductRepo } from "../../domain/port/repo/product/product.repo.interface";
import { ITagRepo } from "../../domain/port/repo/tag.repo.interface";
import { ProductService } from "../../domain/service/product/product.service";
import {
  CreateProductDto,
  GetProductDto,
  GetProductListDto,
  GetLikedProductsDto,
  UpdateProductDto,
  DeleteProductDto,
} from "../../inbound/requests/product/product.req.schemas";
import {
  BusinessExceptionTable,
  BusinessExceptionType,
} from "../../shared/const/business.exception.info";
import { IEventBusUtil } from "../../shared/utils/event-bus.util";

describe("product service 유닛 테스트", () => {
  let mockProductRepo: IProductRepo;
  let mockUserLikesProductRepo: IUserLikesProductRepo;
  let mockTagRepo: ITagRepo;
  let mockNotificationRepo: INotificationRepo;
  let mockEventBusUtil: IEventBusUtil;
  let productService: ProductService;

  beforeAll(() => {});

  beforeEach(() => {
    mockProductRepo = {
      findProductByName: jest.fn(),
      findProductById: jest.fn(),
      findProductLike: jest.fn(),
      findProductList: jest.fn(),
      findUserLikeProducts: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
    mockUserLikesProductRepo = {
      findLikeUserIdsByProduct: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };
    mockTagRepo = {
      findOrCreateTags: jest.fn(),
    };
    mockNotificationRepo = {
      save: jest.fn(),
      findNotificationByIds: jest.fn(),
      getNotifications: jest.fn(),
      countUnread: jest.fn(),
      markAsRead: jest.fn(),
    };
    mockEventBusUtil = {
      subscribe: jest.fn(),
      publish: jest.fn(),
    };
    productService = new ProductService(
      mockProductRepo,
      mockUserLikesProductRepo,
      mockTagRepo,
      mockNotificationRepo,
      mockEventBusUtil,
    );
  });

  afterAll(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("상품 생성 테스트", () => {
    const dto: CreateProductDto = {
      userId: "user-id",
      name: "맥북",
      description: "애플 노트북",
      price: 3000000,
      tags: ["전자기기", "노트북"],
      images: ["img1.png", "img2.png"],
    };

    test("이미 존재하는 상품명이면 예외를 던진다", async () => {
      (mockProductRepo.findProductByName as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      await expect(productService.createProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_ALREADY_EXIST]
          .message,
      );

      expect(mockTagRepo.findOrCreateTags).not.toHaveBeenCalled();
      expect(mockProductRepo.create).not.toHaveBeenCalled();
    });

    test("상품이 정상적으로 생성된다", async () => {
      (mockProductRepo.findProductByName as jest.Mock).mockResolvedValue(null);

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);

      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      jest
        .spyOn(ProductEntity, "createNew")
        .mockReturnValue({} as NewProductEntity);

      (mockProductRepo.create as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      const result = await productService.createProduct(dto);

      expect(mockProductRepo.findProductByName).toHaveBeenCalledWith(dto.name);
      expect(TagEntity.createNew).toHaveBeenCalled();
      expect(mockTagRepo.findOrCreateTags).toHaveBeenCalled();
      expect(ProductEntity.createNew).toHaveBeenCalled();
      expect(mockProductRepo.create).toHaveBeenCalledWith(
        {} as NewProductEntity,
      );
      expect(result).toStrictEqual({} as PersistProductEntity);
    });
  });

  describe("한 상품 정보 가져오기 테스트", () => {
    const dto: GetProductDto = {
      productId: "productId",
    };

    test("상품이 존재하지 않으면 비즈니스 예외를 던져야 합니다.", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );
    });

    test("상품이 있으면 그대로 반환한다", async () => {
      const fakeProduct = { id: "productId" } as PersistProductEntity;

      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(
        fakeProduct,
      );

      const result = await productService.getProduct(dto);

      expect(result).toBe(fakeProduct);
    });
  });

  describe("여러 상품 정보 가져오기 테스트", () => {
    test("limit이 20을 초과하면 예외를 던진다.", async () => {
      const dto: GetProductListDto = {
        offset: 0,
        limit: 21,
        sort: "recent",
      };

      await expect(productService.getProductList(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.LIMIT_MAX_20].message,
      );
    });

    test("sort가 recent면 updatedAt desc로 조회한다", async () => {
      const dto: GetProductListDto = {
        offset: 0,
        limit: 5,
        sort: "recent",
      };
      const fakeProducts = [{} as PersistProductEntity];

      (mockProductRepo.count as jest.Mock).mockResolvedValue(10);
      (mockProductRepo.findProductList as jest.Mock).mockResolvedValue(
        fakeProducts,
      );

      const result = await productService.getProductList(dto);

      expect(mockProductRepo.findProductList).toHaveBeenCalledWith(0, 5, {
        field: "updatedAt",
        sort: "desc",
      });

      expect(result).toBe(fakeProducts);
    });
  });

  describe("한 상품 좋아요 누르기 테스트", () => {
    const dto: GetLikedProductsDto = {
      userId: "userId",
      productId: "productId",
    };

    test("상품이 존재하지 않으면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productService.likeProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockUserLikesProductRepo.create).not.toHaveBeenCalled();
    });

    test("상품이 존재하면 좋아요를 생성한다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      const mockNewLikes = {} as UserLikesProductEntity;
      jest
        .spyOn(UserLikesProductEntity, "createNew")
        .mockReturnValue(mockNewLikes);

      await productService.likeProduct(dto);

      expect(mockUserLikesProductRepo.create).toHaveBeenCalledWith(
        mockNewLikes,
      );
    });
  });

  describe("한 상품 좋아요 취소 누르기 테스트", () => {
    const dto: GetLikedProductsDto = {
      userId: "userId",
      productId: "productId",
    };

    test("상품이 존재하지 않으면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productService.unlikeProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockUserLikesProductRepo.delete).not.toHaveBeenCalled();
    });

    test("상품이 존재하면 좋아요를 삭제한다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      await productService.unlikeProduct(dto);

      expect(mockUserLikesProductRepo.delete).toHaveBeenCalled();
    });
  });

  describe("상품 수정 테스트", () => {
    const dto: UpdateProductDto = {
      userId: "userId",
      productId: "productId",
      name: "new name",
      description: "new desc",
      price: 2000,
      tags: ["tag1"],
      images: ["img1"],
    };

    const mockePersistProduct = {
      id: "productId",
      userId: "userId",
      price: 1000,
      name: "폰",
      description: "아이폰입니다.",
      tags: ["tag1"],
      images: ["img1"],
      update: jest.fn(),
    };

    test("상품이 존재하지 않으면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productService.updateProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );
    });

    test("상품 작성자가 아니면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        userId: "otherUser",
      });

      await expect(productService.updateProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.UNAUTHORIZED_PRODUCT_OWNER]
          .message,
      );
    });

    test("정상적으로 상품을 수정한다 (가격 변경 없음)", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        price: 2000, // 기존과 동일
      });

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      const result = await productService.updateProduct(dto);

      expect(mockePersistProduct.update).toHaveBeenCalled();
      expect(mockProductRepo.update).toHaveBeenCalled();
      expect(mockNotificationRepo.save).not.toHaveBeenCalled();
      expect(mockEventBusUtil.publish).not.toHaveBeenCalled();
      expect(result).toBe(mockePersistProduct);
    });

    test("가격이 변경되면 알림과 이벤트를 발생시킨다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        price: 1000,
      });

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      (
        mockUserLikesProductRepo.findLikeUserIdsByProduct as jest.Mock
      ).mockResolvedValue(["u1", "u2"]);

      await productService.updateProduct(dto);

      expect(mockNotificationRepo.save).toHaveBeenCalledTimes(2);
      expect(mockEventBusUtil.publish).toHaveBeenCalledTimes(1);
    });

    test("가격이 변경되었지만 좋아요 유저가 없으면 이벤트를 발생시키지 않는다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      (
        mockUserLikesProductRepo.findLikeUserIdsByProduct as jest.Mock
      ).mockResolvedValue([]);

      await productService.updateProduct(dto);

      expect(mockNotificationRepo.save).not.toHaveBeenCalled();
      expect(mockEventBusUtil.publish).not.toHaveBeenCalled();
    });
  });

  describe("상품 삭제 테스트", () => {
    const dto: DeleteProductDto = {
      userId: "userId",
      productId: "productId",
    };

    const mockPersistProduct = {
      id: "productId",
      userId: "userId",
    };

    test("상품이 존재하지 않으면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productService.deleteProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockProductRepo.delete).not.toHaveBeenCalled();
    });

    test("상품 작성자가 아니면 예외를 던진다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockPersistProduct,
        userId: "otherUser",
      });

      await expect(productService.deleteProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.UNAUTHORIZED_PRODUCT_OWNER]
          .message,
      );

      expect(mockProductRepo.delete).not.toHaveBeenCalled();
    });

    test("상품 작성자가 맞으면 삭제한다", async () => {
      (mockProductRepo.findProductById as jest.Mock).mockResolvedValue(
        mockPersistProduct,
      );

      await productService.deleteProduct(dto);

      expect(mockProductRepo.delete).toHaveBeenCalledWith(dto.productId);
    });
  });
});
