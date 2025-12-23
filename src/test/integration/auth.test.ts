import request from "supertest";
import { Server } from "../../app/server";
import { app } from "../../index";

describe("Auth API Integration", () => {
  it("회원가입 성공", async () => {
    const res = await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        nickname: "tester",
        password: "123456",
      });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@test.com");
  });

  it("로그인 성공", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({
        email: "test@test.com",
        password: "123456",
      });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});