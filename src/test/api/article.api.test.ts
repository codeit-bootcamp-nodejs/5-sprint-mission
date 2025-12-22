import request from "supertest";

describe("게시글 API 통합 테스트", () => {
    describe("인증이 필요한 게시글 API 테스트", () => {
        describe("인증 없이 요청 시 실패", () => {
            test("게시글 생성 - 인증 없이 요청 시 실패", async () => {
                const newArticle = {
                    title: "title 1",
                    content: "content 1"
                };

                const response = await request(global.testApp)
                    .post("/articles")
                    .send(newArticle);

                expect(response.status).toBe(401);
            });

            test("게시글 수정 - 인증 없이 요청 시 실패", async () => {
                const articleId = 1;
                const updateData = {
                    name: "수정된 게시글"
                };

                const response = await request(global.testApp)
                    .patch(`/articles/${articleId}`)
                    .send(updateData);

                expect(response.status).toBe(401);
            });

            test("게시글 삭제 - 인증 없이 요청 시 실패", async () => {
                const articleId = 1;

                const response = await request(global.testApp)
                    .delete(`/articles/${articleId}`);

                expect(response.status).toBe(401);
            });
        })

        describe("인증 요청 성공", () => {
            let createdArticleId: string;

            test("게시글 작성 성공", async () => {
                const newArticle = {
                    title: "title 1",
                    content: "content 1",
                };

                const createRes = await request(global.testApp)
                    .post("/articles")
                    .set("Authorization", `Bearer ${global.testAccessToken}`)
                    .send(newArticle);

                expect(createRes.status).toBe(201);
                expect(createRes.body?.id).toBeDefined();
                createdArticleId = createRes.body.id;
            })


            test("게시글 수정 성공", async () => {
                const updateData = {
                    title: "updated title",
                    content: "updated content",
                };

                const response = await request(global.testApp)
                    .patch(`/articles/${createdArticleId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`)
                    .send(updateData);

                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
                expect(response.body.title).toBe(updateData.title);
                expect(response.body.content).toBe(updateData.content);
            });

            test("게시글 삭제 성공", async () => {
                const response = await request(global.testApp)
                    .delete(`/articles/${createdArticleId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect(response.status).toBe(200);
            });

        })





    });

    describe("인증이 필요하지 않은 게시글 API 테스트", () => {
        test("게시글 목록 조회", async () => {
            // 게시글 목록 조회
            const response = await request(global.testApp).get("/articles");
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });
    });
});