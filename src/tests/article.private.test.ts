import app from "../app";
import request from "supertest";

test("게시물 등록하려면 인증이 필요함", async () => {
  const res = await request(app).post("/articles");
  expect(res.status).toBe(401);
});
