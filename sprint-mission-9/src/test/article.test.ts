import request from "supertest";
import { app } from "../app";
import prisma from "../prisma.client";

describe("Article Integration Tests", () => {
  let token: string;
  let createdArticleId: number;

  beforeAll(async () => {
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();

    await request(app).post("/api/auth/signUp").send({
      email: "article_tester@test.com",
      nickname: "art_tester",
      password: "password123",
      passwordConfirm: "password123",
    });

    const loginRes = await request(app).post("/api/auth/logIn").send({
      email: "article_tester@test.com",
      password: "password123",
    });
    
    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("게시글 목록 조회 (GET /api/articles) - 인증 없이 성공", async () => {
    const res = await request(app).get("/api/articles");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("게시글 등록 (POST /api/articles) - 인증 필요", async () => {
    const res = await request(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "테스트 게시글",
        content: "내용입니다.",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("테스트 게시글");
    createdArticleId = res.body.id;
  });
});
