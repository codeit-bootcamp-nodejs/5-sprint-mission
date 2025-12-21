import request from "supertest";
import { app } from "../../index";

describe("Public Article API", () => {
  it("게시글 목록 조회", async () => {
    const res = await request(app).get("/articles");
    expect(res.status).toBe(200);
  });
});