import { ProductService } from "../../services/product.service.js";

describe("ProductService", () => {
  test("생성에 스파이 붙이기", () => {
    const service = new ProductService();
    const spy = jest.spyOn(service, "create");

    const result = service.create("apple");

    expect(spy).toHaveBeenCalledWith("apple");
    expect(result.name).toBe("apple");
  });

  test("mock 만들기", () => {
    const service = new ProductService();
    jest.spyOn(service, "create").mockReturnValue({
      id: 99,
      name: "mock",
    });

    const result = service.create("x");

    expect(result.id).toBe(99);
  });
});
