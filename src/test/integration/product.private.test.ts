import request from "supertest";
import { app } from "../../index";

let token: string;

beforeAll(async () => {
  const login = await request(app)
    .post("/users/login")
    .send({ email: "test@test.com", password: "123456" });

  token = login.body.accessToken;
});

describe("Private Product API", () => {
  it("상품 생성", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "상품1",
        description: "설명",
        price: 1000,
      });

    expect(res.status).toBe(201);
  });
});