import request from "supertest";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { Injector } from "../injector";
import { TokenUtil } from "../shared/utils/token.util";
import { ConfigUtil, IConfigUtil } from "../shared/utils/config.util";

describe("article 통합 테스트", () => {
  let app: Application;
  let mockPrismaClient: PrismaClient;
  let articleId: string;
  let userId: string;
  let configUtil: IConfigUtil;
  let token: string;

  beforeAll(async () => {
    mockPrismaClient = new PrismaClient();
    configUtil = new ConfigUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const { httpServer } = new Injector(mockPrismaClient, tokenUtil);
    app = httpServer.app;

    const user = await mockPrismaClient.user.create({
      data: {
        email: "test@test.com1",
        password: "test123!A",
        nickname: "테스트유저",
      },
    });

    userId = user.id;
    token = tokenUtil.generateAccessToken({ userId });

    // 초기 게시글 생성
    const article = await mockPrismaClient.article.create({
      data: { title: "테스트 게시글", content: "초기 내용", userId },
    });
    articleId = article.id;
  });

  afterAll(async () => {
    await mockPrismaClient.notification.deleteMany();
    await mockPrismaClient.articleLike.deleteMany();
    await mockPrismaClient.articleComment.deleteMany();
    await mockPrismaClient.article.deleteMany();
    await mockPrismaClient.user.deleteMany();
    await mockPrismaClient.$disconnect();
  });

  describe("POST /api/articles - 게시글 생성", () => {
    test("성공: DB 데이터 생성, 200", async () => {
      const res = await request(app)
        .post("/api/articles")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "새 게시글", content: "내용입니다!!!!!!!!!!!!!!!" });

      expect(res.status).toBe(200);

      const created = await mockPrismaClient.article.findUnique({
        where: { title: "새 게시글" },
      });
      expect(created).not.toBeNull();
      expect(created!.title).toBe("새 게시글");
    });
  });

  describe("GET /api/articles/:articleId - 게시글 조회", () => {
    test("게시글 조회", async () => {
      const res = await request(app).get(`/api/articles/${articleId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(articleId);
      expect(res.body.title).toBe("테스트 게시글");
    });
  });

  describe("GET /api/articles - 게시글 목록 조회", () => {
    test("게시글 목록 조회", async () => {
      const res = await request(app).get("/api/articles");
      expect(res.status).toBe(200);
    });
  });

  describe("PATCH /api/articles/:articleId - 게시글 수정", () => {
    test("게시글 수정", async () => {
      const res = await request(app)
        .patch(`/api/articles/${articleId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "수정된 게시글", content: "수정 내용" });

      expect(res.status).toBe(200);

      const updated = await mockPrismaClient.article.findUnique({
        where: { id: articleId },
      });
      expect(updated?.title).toBe("수정된 게시글");
      expect(updated?.content).toBe("수정 내용");
    });
  });

  describe("댓글 기능 테스트", () => {
    let commentId: number;

    test("댓글 생성", async () => {
      const res = await request(app)
        .post(`/api/articles/${articleId}/comments`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "첫 댓글입니다!!!!!!" });

      expect(res.status).toBe(200);

      const comment = await mockPrismaClient.articleComment.findFirst({
        where: { articleId, userId },
      });
      expect(comment).not.toBeNull();
      commentId = comment!.id;
    });

    test("댓글 목록 조회", async () => {
      const res = await request(app)
        .get(`/api/articles/${articleId}/comments`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    test("댓글 수정 및 삭제", async () => {
      const comment = await mockPrismaClient.articleComment.create({
        data: { articleId, content: "댓글 수정 테스트", userId },
      });
      commentId = comment.id;

      // 수정
      const resUpdate = await request(app)
        .patch(`/api/articles/${articleId}/comment/${commentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "댓글 수정 완료!!!!!" });
      expect(resUpdate.status).toBe(200);

      const updated = await mockPrismaClient.articleComment.findUnique({
        where: { id: commentId },
      });
      expect(updated?.content).toBe("댓글 수정 완료!!!!!");

      // 삭제
      const resDelete = await request(app)
        .delete(`/api/articles/${articleId}/comment/${commentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(resDelete.status).toBe(200);

      const deleted = await mockPrismaClient.articleComment.findUnique({
        where: { id: commentId },
      });
      expect(deleted).toBeNull();
    });
  });

  describe("좋아요 기능 테스트", () => {
    test("좋아요 추가 및 취소", async () => {
      const resLike = await request(app)
        .post(`/api/articles/${articleId}/like`)
        .set("Authorization", `Bearer ${token}`);
      expect(resLike.status).toBe(200);

      const liked = await mockPrismaClient.articleLike.findFirst({
        where: { articleId, userId },
      });
      expect(liked).not.toBeNull();

      const resCancel = await request(app)
        .delete(`/api/articles/${articleId}/like`)
        .set("Authorization", `Bearer ${token}`);
      expect(resCancel.status).toBe(200);

      const afterCancel = await mockPrismaClient.articleLike.findFirst({
        where: { articleId, userId },
      });
      expect(afterCancel).toBeNull();
    });
  });

  describe("DELETE /api/articles/:articleId - 게시글 삭제", () => {
    test("게시글 삭제", async () => {
      const res = await request(app)
        .delete(`/api/articles/${articleId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      const deleted = await mockPrismaClient.article.findUnique({
        where: { id: articleId },
      });
      expect(deleted).toBeNull();
    });
  });
});
