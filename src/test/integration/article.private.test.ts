import request from "supertest";
import { app } from "../../index";

let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/users/login")
    .send({ email: "test@test.com", password: "123456" });

  token = res.body.accessToken;
});

it("게시글 생성", async () => {
  const res = await request(app)
    .post("/articles")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "제목", content: "내용" });

  expect(res.status).toBe(201);
});