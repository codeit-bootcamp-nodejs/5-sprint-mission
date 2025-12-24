import request from "supertest";
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { Injector } from "../injector";
import { TokenUtil } from "../shared/util/token.util";
import { ConfigUtil } from "../shared/util/config.util";

describe("user 통합 테스트", () => {
  let app: Application;
  let prisma: PrismaClient;

  const testUser = {
    email: "user@test.com",
    password: "Test1234!",
    nickname: "테스트유저",
  };

  beforeAll(async () => {
    prisma = new PrismaClient();
    const configUtil = new ConfigUtil();
    const tokenUtil = new TokenUtil(configUtil);

    const { httpServer } = new Injector(prisma, tokenUtil);
    app = httpServer.app;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe("POST /api/user/sign-up - 회원가입", () => {
    test("회원가입 성공", async () => {
      const res = await request(app)
        .post("/api/user/sign-up")
        .send({
          email: testUser.email,
          password: testUser.password,
          nickname: testUser.nickname,
        });

      expect(res.status).toBe(200);

      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      expect(user).not.toBeNull();
      expect(user?.nickname).toBe(testUser.nickname);
    });

    test("중복 이메일 회원가입 실패", async () => {
      const res = await request(app)
        .post("/api/user/sign-up")
        .send({
          email: testUser.email,
          password: testUser.password,
          nickname: "중복유저",
        });

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/user/sign-in - 로그인", () => {
    test("로그인 성공", async () => {
      const res = await request(app)
        .post("/api/user/sign-in")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.status).toBe(200);

      expect(res.body.accessToken).toBeDefined();
      expect(typeof res.body.accessToken).toBe("string");
    });

    test("비밀번호 틀림 → 로그인 실패", async () => {
      const res = await request(app)
        .post("/api/user/sign-in")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        });

      expect(res.status).toBe(401);
    });
  });
});
