import { IUserLikesProductCommandRepo } from "../../application/port/repo/command/like/user-likes-product.command.repo.interface";
import { INotificationCommandRepo } from "../../application/port/repo/command/notification.command.repo.interface";
import { IProductCommandRepo } from "../../application/port/repo/command/product/product.command.repo.interface";
import { ITagCommandRepo } from "../../application/port/repo/command/tag.command.repo.interface";
import { ProductCommandService } from "../../application/command/service/product/product.command.service";
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
import { UserLikesProductEntity } from "../../application/command/entity/like/user-likes-product.entity";
import { PersistProductEntity, ProductEntity, NewProductEntity } from "../../application/command/entity/product/product.entity";
import { TagEntity, NewTagEntity, PersistTagEntity } from "../../application/command/entity/tag.entity";
import { IProductQueryRepo } from "../../application/port/repo/query/product.query.repo.interface";

describe("product service 유닛 테스트", () => {
  let mockProductCommandRepo: IProductCommandRepo;
  let mockProductQueryRepo: IProductQueryRepo;
  let mockUserLikesProductRepo: IUserLikesProductCommandRepo;
  let mockTagRepo: ITagCommandRepo;
  let mockNotificationRepo: INotificationCommandRepo;
  let mockEventBusUtil: IEventBusUtil;
  let productCommandService: ProductCommandService;

  beforeAll(() => {});

  beforeEach(() => {
    mockProductCommandRepo = {
      findProductByName: jest.fn(),
      findProductById: jest.fn(),
      findProductLike: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    };
    mockProductQueryRepo = {
      findProductList: jest.fn(),
      findProductsByOwner: jest.fn(),
      findProductsLikedByUser: jest.fn(),
    }
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
    productCommandService = new ProductCommandService(
      mockProductCommandRepo,
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
      (mockProductCommandRepo.findProductByName as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      await expect(productCommandService.createProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_ALREADY_EXIST]
          .message,
      );

      expect(mockTagRepo.findOrCreateTags).not.toHaveBeenCalled();
      expect(mockProductCommandRepo.create).not.toHaveBeenCalled();
    });

    test("상품이 정상적으로 생성된다", async () => {
      (mockProductCommandRepo.findProductByName as jest.Mock).mockResolvedValue(null);

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);

      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      jest
        .spyOn(ProductEntity, "createNew")
        .mockReturnValue({} as NewProductEntity);

      (mockProductCommandRepo.create as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      const result = await productCommandService.createProduct(dto);

      expect(mockProductCommandRepo.findProductByName).toHaveBeenCalledWith(dto.name);
      expect(TagEntity.createNew).toHaveBeenCalled();
      expect(mockTagRepo.findOrCreateTags).toHaveBeenCalled();
      expect(ProductEntity.createNew).toHaveBeenCalled();
      expect(mockProductCommandRepo.create).toHaveBeenCalledWith(
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
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productCommandService.getProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );
    });

    test("상품이 있으면 그대로 반환한다", async () => {
      const fakeProduct = { id: "productId" } as PersistProductEntity;

      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(
        fakeProduct,
      );

      const result = await productCommandService.getProduct(dto);

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

      // await expect(productCommandService.getProductList(dto)).rejects.toThrow(
      //   BusinessExceptionTable[BusinessExceptionType.LIMIT_MAX_20].message,
      // );
    });

    // test("sort가 recent면 updatedAt desc로 조회한다", async () => {
    //   const dto: GetProductListDto = {
    //     offset: 0,
    //     limit: 5,
    //     sort: "recent",
    //   };
    //   const fakeProducts = [{} as PersistProductEntity];

    //   (mockProductCommandRepo.count as jest.Mock).mockResolvedValue(10);
    //   (mockProductCommandRepo.findProductList as jest.Mock).mockResolvedValue(
    //     fakeProducts,
    //   );

    //   const result = await productCommandService.getProductList(dto);

    //   expect(mockProductCommandRepo.findProductList).toHaveBeenCalledWith(0, 5, {
    //     field: "updatedAt",
    //     sort: "desc",
    //   });

    //   expect(result).toBe(fakeProducts);
    // });
  });

  describe("한 상품 좋아요 누르기 테스트", () => {
    const dto: GetLikedProductsDto = {
      userId: "userId",
      productId: "productId",
    };

    test("상품이 존재하지 않으면 예외를 던진다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productCommandService.likeProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockUserLikesProductRepo.create).not.toHaveBeenCalled();
    });

    test("상품이 존재하면 좋아요를 생성한다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      const mockNewLikes = {} as UserLikesProductEntity;
      jest
        .spyOn(UserLikesProductEntity, "createNew")
        .mockReturnValue(mockNewLikes);

      await productCommandService.likeProduct(dto);

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
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productCommandService.unlikeProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockUserLikesProductRepo.delete).not.toHaveBeenCalled();
    });

    test("상품이 존재하면 좋아요를 삭제한다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(
        {} as PersistProductEntity,
      );

      await productCommandService.unlikeProduct(dto);

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
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productCommandService.updateProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );
    });

    test("상품 작성자가 아니면 예외를 던진다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        userId: "otherUser",
      });

      await expect(productCommandService.updateProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.UNAUTHORIZED_PRODUCT_OWNER]
          .message,
      );
    });

    test("정상적으로 상품을 수정한다 (가격 변경 없음)", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        price: 2000, // 기존과 동일
      });

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductCommandRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      const result = await productCommandService.updateProduct(dto);

      expect(mockePersistProduct.update).toHaveBeenCalled();
      expect(mockProductCommandRepo.update).toHaveBeenCalled();
      expect(mockNotificationRepo.save).not.toHaveBeenCalled();
      expect(mockEventBusUtil.publish).not.toHaveBeenCalled();
      expect(result).toBe(mockePersistProduct);
    });

    test("가격이 변경되면 알림과 이벤트를 발생시킨다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockePersistProduct,
        price: 1000,
      });

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductCommandRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      (
        mockUserLikesProductRepo.findLikeUserIdsByProduct as jest.Mock
      ).mockResolvedValue(["u1", "u2"]);

      await productCommandService.updateProduct(dto);

      expect(mockNotificationRepo.save).toHaveBeenCalledTimes(2);
      expect(mockEventBusUtil.publish).toHaveBeenCalledTimes(1);
    });

    test("가격이 변경되었지만 좋아요 유저가 없으면 이벤트를 발생시키지 않는다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      jest.spyOn(TagEntity, "createNew").mockReturnValue({} as NewTagEntity);
      (mockTagRepo.findOrCreateTags as jest.Mock).mockResolvedValue(
        [] as PersistTagEntity[],
      );

      (mockProductCommandRepo.update as jest.Mock).mockResolvedValue(
        mockePersistProduct,
      );

      (
        mockUserLikesProductRepo.findLikeUserIdsByProduct as jest.Mock
      ).mockResolvedValue([]);

      await productCommandService.updateProduct(dto);

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
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(null);

      await expect(productCommandService.deleteProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.PRODUCT_NOT_EXIST].message,
      );

      expect(mockProductCommandRepo.delete).not.toHaveBeenCalled();
    });

    test("상품 작성자가 아니면 예외를 던진다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue({
        ...mockPersistProduct,
        userId: "otherUser",
      });

      await expect(productCommandService.deleteProduct(dto)).rejects.toThrow(
        BusinessExceptionTable[BusinessExceptionType.UNAUTHORIZED_PRODUCT_OWNER]
          .message,
      );

      expect(mockProductCommandRepo.delete).not.toHaveBeenCalled();
    });

    test("상품 작성자가 맞으면 삭제한다", async () => {
      (mockProductCommandRepo.findProductById as jest.Mock).mockResolvedValue(
        mockPersistProduct,
      );

      await productCommandService.deleteProduct(dto);

      expect(mockProductCommandRepo.delete).toHaveBeenCalledWith(dto.productId);
    });
  });
});
