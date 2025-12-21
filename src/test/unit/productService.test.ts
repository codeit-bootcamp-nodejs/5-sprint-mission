import { ProductService } from "../../service/productService";

const prismaMock = {
  product: {
    create: jest.fn(),
  },
};

describe("ProductService Unit Test", () => {
  const notificationMock = { createNotification: jest.fn() } as any;
  const service = new ProductService(prismaMock as any, notificationMock);

  it("상품 생성 비즈니스 로직", async () => {
    prismaMock.product.create.mockResolvedValue({ id: "1" });

    const result = await service.createProduct({
      name: "상품",
      price: 1000,
      userId: "user1",
    });

    expect(prismaMock.product.create).toHaveBeenCalled();
    expect(result.id).toBe("1");
  });
});