import request from "supertest";
import { app } from "../app";
import prisma from "../prisma.client";

describe("Product Integration Tests", () => {
  let token: string;
  let createdProductId: number;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await request(app).post("/api/auth/signUp").send({
      email: "product_tester@test.com",
      nickname: "prod_tester",
      password: "password123",
      passwordConfirm: "password123",
    });

    const loginRes = await request(app).post("/api/auth/logIn").send({
      email: "product_tester@test.com",
      password: "password123",
    });

    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("상품 목록 조회 (GET /api/products) - 인증 없이 성공", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("상품 등록 (POST /api/products) - 인증 필요", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "테스트 상품",
        description: "설명",
        price: 10000,
        tags: ["tag1"],
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("테스트 상품");
    createdProductId = res.body.id;
  });
});
