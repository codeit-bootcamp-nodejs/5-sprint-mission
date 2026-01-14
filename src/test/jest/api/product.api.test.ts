import request from "supertest";

describe("상품 API 통합 테스트", () => {
  describe("인증이 필요하지 않은 상품 API 테스트", () => {
    test("상품 목록 조회", async () => {
      // 상품 목록 조회
      const response = await request(global.testApp).get("/products");
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  describe("인증이 필요한 상품 API 테스트", () => {
    describe("인증 없이 요청 시 실패", () => {
      test("상품 생성 실패", async () => {
        const newProduct = {
          name: "테스트 상품",
          description: "테스트 설명",
          price: 10000,
          tags: ["Electronics", "HomeGoods"],
        };

        const response = await request(global.testApp)
          .post("/products")
          .send(newProduct);

        expect(response.status).toBe(401);
      });

      test("상품 수정 실패", async () => {
        const productId = 1;
        const updateData = {
          name: "수정된 상품",
          description: "수정된 설명",
          price: 15000,
          tags: ["Electronics"],
        };

        const response = await request(global.testApp)
          .patch(`/products/${productId}`)
          .send(updateData);

        expect(response.status).toBe(401);
      });

      test("상품 삭제 실패", async () => {
        const productId = 1;

        const response = await request(global.testApp).delete(
          `/products/${productId}`,
        );

        expect(response.status).toBe(401);
      });
    });

    describe("인증 요청 성공", () => {
      let createdProductId: string;

      test("상품 생성 성공", async () => {
        const newProduct = {
          name: "Organic Coffee Beans",
          description: "Premium organic coffee beans from Colombia",
          price: 24.99,
          tags: ["Electronics"],
        };

        const createRes = await request(global.testApp)
          .post("/products")
          .set("Authorization", `Bearer ${global.testAccessToken}`)
          .send(newProduct);

        expect(createRes.status).toBe(201);
        expect(createRes.body?.id).toBeDefined();
        createdProductId = createRes.body.id;
      });

      test("상품 수정 성공", async () => {
        const updateData = {
          name: "수정된 상품",
          description: "수정된 설명입니다",
          price: 30000,
          tags: ["LuxuryGoods"],
        };

        const response = await request(global.testApp)
          .patch(`/products/${createdProductId}`)
          .set("Authorization", `Bearer ${global.testAccessToken}`)
          .send(updateData);

        expect(response.status).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe(updateData.name);
        expect(response.body.price).toBe(updateData.price);
      });

      test("상품 삭제 성공", async () => {
        const response = await request(global.testApp)
          .delete(`/products/${createdProductId}`)
          .set("Authorization", `Bearer ${global.testAccessToken}`);

        expect(response.status).toBe(200);
      });
    });
  });
});
