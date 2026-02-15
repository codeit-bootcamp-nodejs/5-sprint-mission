import { ProductService } from "../service/product.service";
import { ProductRepository } from "../repo/product.repository";
import { NotificationService } from "../service/notification.service";
import { CreateProductDto } from "../dto/product.dto";

jest.mock("../repo/product.repository");
jest.mock("../service/notification.service");

describe("ProductService Unit Test", () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<ProductRepository>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    productRepository =
      new ProductRepository() as jest.Mocked<ProductRepository>;
    notificationService = new NotificationService(
      {} as any,
      {} as any,
    ) as jest.Mocked<NotificationService>;
    productService = new ProductService(productRepository, notificationService);
  });

  test("상품 생성 로직 테스트 (createProduct)", async () => {
    const userId = 1;
    const dto: CreateProductDto = {
      name: "New Product",
      description: "Desc",
      price: 5000,
      tags: ["new"],
    };

    const mockCreatedProduct = {
      id: 10,
      authorId: userId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    productRepository.createProduct.mockResolvedValue(
      mockCreatedProduct as any,
    );

    const result = await productService.createProduct(userId, dto);

    expect(productRepository.createProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.createProduct).toHaveBeenCalledWith(userId, dto);
    expect(result).toEqual(mockCreatedProduct);
  });
});
