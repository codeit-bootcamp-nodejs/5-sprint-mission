import request from "supertest"

describe("상품 댓글 API 유닛 테스트", () => {
    let productId: string = "";
    let commentId: string = "";

    beforeAll(async () => {
        const newProduct = {
            name: "Organic Coffee Beans",
            description: "Premium organic coffee beans from Colombia",
            price: 24.99,
            tags: ["Electronics"]
        };

        const createRes = await request(global.testApp)
            .post("/products")
            .set("Authorization", `Bearer ${global.testAccessToken}`)
            .send(newProduct);

        expect(createRes.status).toBe(201);
        expect(createRes.body?.id).toBeDefined();
        productId = createRes.body.id;
    })

    describe("인증이 필요한 상품 API 테스트", () => {
        describe("인증 요청 성공", () => {
            test("상품 댓글 작성", async () => {
                const newComment = {
                    content: "new comment",
                    productId: productId  // productId를 바디에 포함
                }

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .post(`/product/${productId}/comments`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`)
                    .send(newComment);
                commentId = createRes.body.id;
                expect(createRes.status).toBe(201);
                expect(createRes.body).toBeDefined();
            })

            test("상품 댓글 수정", async () => {
                const updatedComment = {
                    content: "updated comment",
                    productId: productId  // productId를 바디에 포함
                }

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .patch(`/product/${productId}/comments/${commentId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`)
                    .send(updatedComment);

                expect(createRes.status).toBe(200);
                expect(createRes.body).toBeDefined();
            })

            test("상품 댓글 삭제", async () => {

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .delete(`/product/${productId}/comments/${commentId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`)

                expect(createRes.status).toBe(200);

            })
        })

        describe("인증 없이 요청 시 실패", () => {
            test("상품 댓글 작성 - 실패", async () => {
                const newComment = {
                    content: "new comment",
                    productId: productId  // productId를 바디에 포함
                }

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .post(`/product/${productId}/comments`)
                    .send(newComment);
                commentId = createRes.body.id;
                expect(createRes.status).toBe(401);
            })

            test("상품 댓글 수정 - 실패", async () => {
                const updatedComment = {
                    content: "updated comment",
                    productId: productId  // productId를 바디에 포함
                }

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .patch(`/product/${productId}/comments/${commentId}`)
                    .send(updatedComment);

                expect(createRes.status).toBe(401);
            })

            test("상품 댓글 삭제 - 실패", async () => {

                // 시도: /products/:productId/comments 대신 다른 경로들
                let createRes = await request(global.testApp)
                    .delete(`/product/${productId}/comments/${commentId}`)

                expect(createRes.status).toBe(401);

            })
        })
    })

    describe("인증이 필요없는 상품 API 테스트", () => {
        test("상품 댓글 조회", async () => {

            // 시도: /products/:productId/comments 대신 다른 경로들
            let createRes = await request(global.testApp)
                .get(`/product/${productId}/comments`)
                .set("Authorization", `Bearer ${global.testAccessToken}`)

            expect(createRes.status).toBe(200);

        })
    })

})