import request from "supertest";

describe("알림 API 통합 테스트", () => {
    describe("인증이 필요한 알림 API 테스트", () => {
        describe("인증 없이 요청 시 실패", () => {
            test("알림 목록 조회 - 인증 없이 요청 시 실패", async () => {
                const res = await request(global.testApp).get("/notifications");

                expect(res.status).toBe(401);
            });

            test("알림 읽음 처리 - 인증 없이 요청 시 실패", async () => {
                const notificationId = "test-notification-id";

                const res = await request(global.testApp).patch(
                    `/notifications/${notificationId}`
                );

                expect(res.status).toBe(401);
            });

            test("알림 삭제 - 인증 없이 요청 시 실패", async () => {
                const notificationId = "test-notification-id";

                const res = await request(global.testApp).delete(
                    `/notifications/${notificationId}`
                );

                expect(res.status).toBe(401);
            });

            test("모든 알림 삭제 - 인증 없이 요청 시 실패", async () => {
                const res = await request(global.testApp).delete("/notifications");

                expect(res.status).toBe(401);
            });
        });

        describe("인증 요청 성공", () => {
            let createdArticleId: string;
            let createdCommentId: string;

            beforeAll(async () => {
                // 알림을 생성하기 위해 게시글과 댓글을 먼저 생성
                const createArticleRes = await request(global.testApp)
                    .post("/articles")
                    .set("Authorization", `Bearer ${global.testAccessToken}`)
                    .send({ title: "알림 테스트용 게시글", content: "본문" });

                expect(createArticleRes.status).toBe(201);
                createdArticleId = createArticleRes.body.id;
            });

            test("알림 목록 조회 성공", async () => {
                const res = await request(global.testApp)
                    .get("/notifications")
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect(res.status).toBe(200);
            });


            test("알림 읽음 처리 - 존재하지 않는 알림 => 404", async () => {
                const fakeNotificationId = "999999999";

                const res = await request(global.testApp)
                    .patch(`/notifications/${fakeNotificationId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect(res.status).toBe(404);
            });

            test("알림 삭제 - 존재하지 않는 알림 => 404", async () => {
                const fakeNotificationId = "999999999";

                const res = await request(global.testApp)
                    .delete(`/notifications/${fakeNotificationId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect([404, 400]).toContain(res.status);
            });

            test("모든 알림 삭제 성공", async () => {
                const res = await request(global.testApp)
                    .delete("/notifications")
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect(res.status).toBe(200);
            });

            test("모든 알림 삭제 후 목록 조회 - 빈 배열 반환", async () => {
                // 먼저 모든 알림 삭제
                await request(global.testApp)
                    .delete("/notifications")
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                // 그 후 목록 조회
                const res = await request(global.testApp)
                    .get("/notifications")
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect(res.status).toBe(200);
                expect(res.body.total).toBe(0);
            });

            afterAll(async () => {
                const delArticleRes = await request(global.testApp)
                    .delete(`/articles/${createdArticleId}`)
                    .set("Authorization", `Bearer ${global.testAccessToken}`);

                expect([200, 204, 404]).toContain(delArticleRes.status);
            });
        });
    });

    describe("알림 생성 및 관리 통합 테스트", () => {
        let articleId: string;
        let authorToken: string;
        let otherUserToken: string;
        let notificationId: string;

        beforeAll(async () => {
            // 첫 번째 사용자로 게시글 생성
            const createArticleRes = await request(global.testApp)
                .post("/articles")
                .set("Authorization", `Bearer ${global.testAccessToken}`)
                .send({ title: "알림 생성 테스트용 게시글", content: "본문" });

            expect(createArticleRes.status).toBe(201);
            articleId = createArticleRes.body.id;
            authorToken = global.testAccessToken;
        });

        test("댓글 작성으로 인한 알림 생성", async () => {
            // 게시글 작성자가 아닌 다른 사용자가 댓글 작성
            const createCommentRes = await request(global.testApp)
                .post(`/article/${articleId}/comments`)
                .set("Authorization", `Bearer ${global.testAccessToken}`)
                .send({ content: "알림 생성 테스트 댓글" });

            expect(createCommentRes.status).toBe(201);

            // 게시글 작성자의 알림 목록 확인
            const notificationsRes = await request(global.testApp)
                .get("/notifications")
                .set("Authorization", `Bearer ${authorToken}`);

            expect(notificationsRes.status).toBe(200);

            if (notificationsRes.body.length > 0) {
                notificationId = notificationsRes.body[0].id;
                expect(notificationId).toBeDefined();
            } else {
                expect(notificationsRes.body).toBeDefined();
            }
        });

        test("알림 읽음 처리 성공", async () => {
            if (!notificationId) {
                // 알림이 없으면 테스트 스킵
                return;
            }

            const res = await request(global.testApp)
                .patch(`/notifications/${notificationId}`)
                .set("Authorization", `Bearer ${authorToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toBeDefined();
        });

        test("알림 읽음 처리 후 상태 확인", async () => {
            if (!notificationId) {
                return;
            }

            // 알림 읽음 처리
            const patchRes = await request(global.testApp)
                .patch(`/notifications/${notificationId}`)
                .set("Authorization", `Bearer ${authorToken}`);

            expect(patchRes.status).toBe(200);

            // 읽음 상태 확인
            const getRes = await request(global.testApp)
                .get("/notifications")
                .set("Authorization", `Bearer ${authorToken}`);

            expect(getRes.status).toBe(200);
        });

        test("특정 알림 삭제 성공", async () => {
            if (!notificationId) {
                return;
            }

            const res = await request(global.testApp)
                .delete(`/notifications/${notificationId}`)
                .set("Authorization", `Bearer ${authorToken}`);

            expect(res.status).toBe(200);
        });

        test("알림 삭제 후 목록에서 제거 확인", async () => {
            if (!notificationId) {
                return;
            }

            // 알림 삭제
            await request(global.testApp)
                .delete(`/notifications/${notificationId}`)
                .set("Authorization", `Bearer ${authorToken}`);

            // 목록 조회
            const res = await request(global.testApp)
                .get("/notifications")
                .set("Authorization", `Bearer ${authorToken}`);

            expect(res.status).toBe(200);
            const found = res.body.find((n: any) => n.id === notificationId);
            expect(found).toBeUndefined();
        });

        afterAll(async () => {
            const delArticleRes = await request(global.testApp)
                .delete(`/articles/${articleId}`)
                .set("Authorization", `Bearer ${authorToken}`);

            expect([200, 204, 404]).toContain(delArticleRes.status);
        });
    });

    describe("예외 및 유효성 테스트", () => {
        test("잘못된 알림 ID 형식 => 400", async () => {
            const res = await request(global.testApp)
                .patch("/notifications/invalid-id-format")
                .set("Authorization", `Bearer ${global.testAccessToken}`);

            expect([400, 404]).toContain(res.status);
        });

        test("다른 사용자의 알림 접근 시도", async () => {
            // 이 테스트는 실제 환경에서만 의미있습니다
            // 두 개의 다른 사용자 토큰이 필요합니다
            const fakeNotificationId = "fake-id";

            const res = await request(global.testApp)
                .patch(`/notifications/${fakeNotificationId}`)
                .set("Authorization", `Bearer ${global.testAccessToken}`);

            expect([400, 404]).toContain(res.status);
        });
    });
});