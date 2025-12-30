import request from "supertest";

describe("게시글 댓글 API 유닛 테스트", () => {
  let articleId: string = "";
  let commentId: string = "";

  beforeAll(async () => {
    // 새로운 게시글 생성
    const newArticle = {
      title: "article title",
      content: "article content",
    };

    const createRes = await request(global.testApp)
      .post("/articles")
      .set("Authorization", `Bearer ${global.testAccessToken}`)
      .send(newArticle);

    expect(createRes.status).toBe(201);
    expect(createRes.body?.id).toBeDefined();
    articleId = createRes.body.id;
  });

  describe("인증이 필요한 API 테스트", () => {
    describe("인증 없이 요청 시 실패", () => {
      test("게시글 댓글 작성 - 실패", async () => {
        const newComment = {
          content: "new comment",
          articleId: articleId, // articleId를 바디에 포함
        };

        let createRes = await request(global.testApp)
          .post(`/article/${articleId}/comments`)
          .send(newComment);
        commentId = createRes.body.id;
        expect(createRes.status).toBe(401);
      });

      test("게시글 댓글 수정 - 실패", async () => {
        const updatedComment = {
          content: "updated comment",
          articleId: articleId,
        };

        let createRes = await request(global.testApp)
          .patch(`/article/${articleId}/comments/${commentId}`)
          .send(updatedComment);

        expect(createRes.status).toBe(401);
      });

      test("게시글 댓글 삭제 - 실패", async () => {
        let createRes = await request(global.testApp).delete(
          `/article/${articleId}/comments/${commentId}`,
        );

        expect(createRes.status).toBe(401);
      });
    });

    describe("인증 요청 성공", () => {
      test("게시글 댓글 작성", async () => {
        const newComment = {
          content: "new comment",
          articleId: articleId, // articleId를 바디에 포함
        };

        let createRes = await request(global.testApp)
          .post(`/article/${articleId}/comments`)
          .set("Authorization", `Bearer ${global.testAccessToken}`)
          .send(newComment);
        commentId = createRes.body.id;
        expect(createRes.status).toBe(201);
        expect(createRes.body).toBeDefined();
      });

      test("게시글 댓글 수정", async () => {
        const updatedComment = {
          content: "updated comment",
          articleId: articleId,
        };

        let createRes = await request(global.testApp)
          .patch(`/article/${articleId}/comments/${commentId}`)
          .set("Authorization", `Bearer ${global.testAccessToken}`)
          .send(updatedComment);

        expect(createRes.status).toBe(200);
        expect(createRes.body).toBeDefined();
      });

      test("게시글 댓글 삭제", async () => {
        let createRes = await request(global.testApp)
          .delete(`/article/${articleId}/comments/${commentId}`)
          .set("Authorization", `Bearer ${global.testAccessToken}`);

        expect(createRes.status).toBe(200);
      });
    });
  });

  describe("인증이 필요 없는 API 테스트", () => {
    test("게시글 댓글 조회", async () => {
      let createRes = await request(global.testApp)
        .get(`/article/${articleId}/comments`)
        .set("Authorization", `Bearer ${global.testAccessToken}`);

      expect(createRes.status).toBe(200);
    });
  });
});
