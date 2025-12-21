import request from "supertest";
import { app } from "../../index";

describe("Public Product API", () => {
  it("상품 목록 조회", async () => {
    const res = await request(app).get("/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});