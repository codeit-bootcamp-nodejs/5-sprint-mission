import app from "../app";
import request from "supertest";

test("인증 없으면 실패", async () => {
  const res = await request(app).post("/products");
  expect(res.status).toBe(401);
});
