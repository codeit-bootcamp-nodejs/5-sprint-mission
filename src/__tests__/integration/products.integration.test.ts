import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../common/lib/prisma.client";
import productsRouter from "../../inbound/routers/products.router";

describe("(인증 불필요)상품 API 통합 테스트", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/products", productsRouter);
  });

  beforeEach(async () => {
    await prismaClient.product.deleteMany({});
  });

  afterEach(async () => {
    await prismaClient.product.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.product.deleteMany({});
    await prismaClient.$disconnect();
  });

  describe("(인증 불필요) GET /products - 상품 목록 조회", () => {
    it("상품이 없을 때 빈 배열 반환", async () => {
      const response = await request(app).get("/products").expect(200);

      expect(response.body).toHaveProperty("list");
      expect(response.body.list).toEqual([]);
    });

    it("상품이 여러 개 있을 때 목록 반환", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const testProducts = await Promise.all([
        prismaClient.product.create({
          data: {
            name: "상품 1",
            description: "설명 1",
            price: 10000,
            userId: testUser.id,
          },
        }),
        prismaClient.product.create({
          data: {
            name: "상품 2",
            description: "설명 2",
            price: 20000,
            userId: testUser.id,
          },
        }),
      ]);

      const response = await request(app).get("/products").expect(200);

      expect(response.body.list).toHaveLength(2);
      expect(response.body.list[0]).toHaveProperty("id");
      expect(response.body.list[0]).toHaveProperty("name");
      expect(response.body.list[0]).toHaveProperty("price");
    });

    it("페이지네이션 쿼리 파라미터 처리", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      for (let i = 1; i <= 5; i++) {
        await prismaClient.product.create({
          data: {
            name: `상품 ${i}`,
            description: `설명 ${i}`,
            price: i * 10000,
            userId: testUser.id,
          },
        });
      }

      const response = await request(app)
        .get("/products")
        .query({ page: 1, pageSize: 2 })
        .expect(200);

      expect(response.body.list).toHaveLength(2);
      expect(response.body).toHaveProperty("totalCount");
      expect(response.body.totalCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /products/:id - 상품 상세 조회 (인증 불필요)", () => {
    it("존재하는 상품 조회 성공", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const product = await prismaClient.product.create({
        data: {
          name: "테스트 상품",
          description: "테스트 설명",
          price: 15000,
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/products/${product.id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(product.id);
      expect(response.body.name).toBe("테스트 상품");
      expect(response.body.price).toBe(15000);
    });

    it("존재하지 않는 상품 조회 시, 404 반환", async () => {
      await request(app).get("/products/99999").expect(404);
    });

    it("잘못된 ID 형식으로 조회 시, 에러 반환", async () => {
      await request(app).get("/products/invalid-id").expect(400);
    });

    it("상품 상세 조회 시, 모든 필드 포함", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const product = await prismaClient.product.create({
        data: {
          name: "상세 조회 테스트",
          description: "상세 설명",
          price: 25000,
          images: ["test-image.jpg"],
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/products/${product.id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("description");
      expect(response.body).toHaveProperty("price");
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });
  });

  describe("상품 API 응답 형식", () => {
    it("목록 조회 응답 형식 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      await prismaClient.product.create({
        data: {
          name: "테스트 상품",
          description: "테스트",
          price: 10000,
          userId: testUser.id,
        },
      });

      const response = await request(app).get("/products").expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          list: expect.any(Array),
          totalCount: expect.any(Number),
        }),
      );
    });

    it("응답 상태 코드 확인", async () => {
      await request(app)
        .get("/products")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("상품 API 성능 테스트", () => {
    it("많은 상품 조회 시, 성능 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const products = Array.from({ length: 20 }, (_, i) =>
        prismaClient.product.create({
          data: {
            name: `상품 ${i + 1}`,
            description: `설명 ${i + 1}`,
            price: (i + 1) * 1000,
            userId: testUser.id,
          },
        }),
      );

      await Promise.all(products);

      const startTime = Date.now();
      const response = await request(app)
        .get("/products")
        .query({ page: 1, pageSize: 10 });
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });

  describe("상품 API 에러 처리", () => {
    it("서버 에러 시, 500 상태 코드 반환", async () => {});

    it("존재하지 않는 상품 조회 시, 적절한 에러 메시지 반환", async () => {
      const response = await request(app).get("/products/99999").expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});
