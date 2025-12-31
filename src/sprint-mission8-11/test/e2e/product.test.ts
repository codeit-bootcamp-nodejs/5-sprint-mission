import request from "supertest";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { Injector } from "../../injector";
import { TokenUtil } from "../../shared/utils/token.util";
import { ConfigUtil, IConfigUtil } from "../../shared/utils/config.util";

describe("product 통합 테스트", () => {
  let app: Application;
  let prisma: PrismaClient;
  let productId: string;
  let userId: string;
  let configUtil: IConfigUtil;
  let token: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    configUtil = new ConfigUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const { httpServer } = new Injector(prisma, tokenUtil);
    app = httpServer.app;

    const user = await prisma.user.create({
      data: {
        email: "test@test.com1",
        password: "test123!A",
        nickname: "테스트유저",
      },
    });

    userId = user.id;
    token = tokenUtil.generateAccessToken({ userId });

    const product = await prisma.product.create({
      data: {
        name: "테스트 상품",
        description: "상품 설명",
        price: 10000,
        userId,
      },
    });

    productId = product.id;
  });

  afterAll(async () => {
    await prisma.notification.deleteMany();
    await prisma.productLike.deleteMany();
    await prisma.productComment.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /api/products - 상품 생성", () => {
    test("성공", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "새 상품",
          description: "상품 내용",
          price: 20000,
          productImages: [],
          productTags: [],
        });

      expect(res.status).toBe(200);

      const created = await prisma.product.findUnique({
        where: { name: "새 상품" },
      });
      expect(created).not.toBeNull();
    });
  });

  describe("GET /api/products/:productId - 상품 조회", () => {
    test("상품 조회", async () => {
      const res = await request(app).get(`/api/products/${productId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(productId);
    });
  });

  describe("GET /api/products - 상품 목록 조회", () => {
    test("상품 목록 조회", async () => {
      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /api/products/:productId - 상품 수정", () => {
    test("상품 수정", async () => {
      const res = await request(app)
        .patch(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "수정된 상품",
          description: "수정된 설명",
          price: 30000,
          productImages: [],
          productTags: [],
        });

      expect(res.status).toBe(200);

      const updated = await prisma.product.findUnique({
        where: { id: productId },
      });
      expect(updated?.name).toBe("수정된 상품");
    });
  });

  describe("댓글 기능 테스트", () => {
    let commentId: number;

    test("댓글 생성", async () => {
      const res = await request(app)
        .post(`/api/products/${productId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "상품 댓글입니다" });

      expect(res.status).toBe(200);

      const comment = await prisma.productComment.findFirst({
        where: { productId, userId },
      });

      expect(comment).not.toBeNull();
      commentId = comment!.id;
    });

    test("댓글 목록 조회", async () => {
      const res = await request(app).get(`/api/products/${productId}/comments`);

      expect(res.status).toBe(200);
    });

    test("댓글 수정 및 삭제", async () => {
      const comment = await prisma.productComment.create({
        data: {
          productId,
          userId,
          content: "수정 전 댓글",
        },
      });

      commentId = comment.id;

      const resUpdate = await request(app)
        .patch(`/api/products/${productId}/comment/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "댓글 수정 완료" });

      expect(resUpdate.status).toBe(200);

      const updated = await prisma.productComment.findUnique({
        where: { id: commentId },
      });
      expect(updated?.content).toBe("댓글 수정 완료");

      const resDelete = await request(app)
        .delete(`/api/products/${productId}/comment/${commentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(resDelete.status).toBe(200);

      const deleted = await prisma.productComment.findUnique({
        where: { id: commentId },
      });
      expect(deleted).toBeNull();
    });
  });

  describe("좋아요 기능 테스트", () => {
    test("좋아요 추가 및 취소", async () => {
      const resLike = await request(app)
        .post(`/api/products/${productId}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(resLike.status).toBe(200);

      const liked = await prisma.productLike.findFirst({
        where: { productId, userId },
      });
      expect(liked).not.toBeNull();

      const resCancel = await request(app)
        .delete(`/api/products/${productId}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(resCancel.status).toBe(200);

      const afterCancel = await prisma.productLike.findFirst({
        where: { productId, userId },
      });
      expect(afterCancel).toBeNull();
    });
  });

  describe("DELETE /api/products/:productId - 상품 삭제", () => {
    test("상품 삭제", async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const deleted = await prisma.product.findUnique({
        where: { id: productId },
      });
      expect(deleted).toBeNull();
    });
  });
});
