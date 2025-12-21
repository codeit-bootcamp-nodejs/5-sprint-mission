import app from "../app";
import request from "supertest";

test("게시물 가져오기", async () => {
  const res = await request(app).get("/articles");
  expect(res.status).toBe(200);
});
