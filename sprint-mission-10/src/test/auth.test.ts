import request from "supertest";
import { app } from "../app";
import prisma from "../prisma.client";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let accessToken: string;

  it("회원가입 API (POST /api/auth/signUp)", async () => {
    const res = await request(app).post("/api/auth/signUp").send({
      email: "test@example.com",
      nickname: "tester",
      password: "password123",
      passwordConfirm: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@example.com");
  });

  it("로그인 API (POST /api/auth/logIn)", async () => {
    const res = await request(app).post("/api/auth/logIn").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    accessToken = res.body.accessToken;
  });
});
