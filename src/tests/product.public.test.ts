import app from "../app";
import request from "supertest";

test("제품 돌려주기", async () => {
  const res = await request(app).get("/products");
  expect(res.status).toBe(200);
  expect(res.body).toEqual(expect.any(Array));
});
