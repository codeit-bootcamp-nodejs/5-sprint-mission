import app from "../app";
import request from "supertest";

describe("인증 API", () => {
  test("로그인 - 잘못된 정보면 401", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });

  test("회원가입 - 이미 존재하는 이메일이면 409", async () => {
    const res = await request(app).post("/auth/signup").send({
      email: "asd@asd.com",
      password: "asdasd12",
      nickname: "tester",
    });

    expect([201, 409]).toContain(res.status);
  });
});
