import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../common/lib/prisma.client";
import articlesRouter from "../../inbound/routers/articles.router";
import { signToken } from "../../common/lib/jwt";

describe("게시글 API 통합 테스트 - 인증 불필요", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/articles", articlesRouter);
  });

  beforeEach(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});
  });

  afterEach(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
  });

  describe("GET /articles - 게시글 목록 조회 (인증 불필요)", () => {
    it("게시글이 없을 때 빈 배열 반환", async () => {
      const response = await request(app).get("/articles").expect(200);

      expect(response.body).toHaveProperty("list");
      expect(response.body.list).toEqual([]);
    });

    it("게시글이 여러 개 있을 때 목록 반환", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const testArticles = await Promise.all([
        prismaClient.article.create({
          data: {
            title: "게시글 1",
            content: "내용 1",
            userId: testUser.id,
          },
        }),
        prismaClient.article.create({
          data: {
            title: "게시글 2",
            content: "내용 2",
            userId: testUser.id,
          },
        }),
      ]);

      const response = await request(app).get("/articles").expect(200);

      expect(response.body.list).toHaveLength(2);
      expect(response.body.list[0]).toHaveProperty("id");
      expect(response.body.list[0]).toHaveProperty("title");
      expect(response.body.list[0]).toHaveProperty("content");
      expect(response.body.list[0]).toHaveProperty("userId");
    });

    it("페이지네이션 쿼리 파라미터 처리", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      for (let i = 1; i <= 10; i++) {
        await prismaClient.article.create({
          data: {
            title: `게시글 ${i}`,
            content: `내용 ${i}`,
            userId: testUser.id,
          },
        });
      }

      const response = await request(app)
        .get("/articles")
        .query({ page: 1, pageSize: 5 })
        .expect(200);

      expect(response.body.list).toHaveLength(5);
      expect(response.body).toHaveProperty("totalCount");
      expect(response.body.totalCount).toBe(10);
    });

    it("최신 순 정렬", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const article1 = await prismaClient.article.create({
        data: {
          title: "첫 번째 게시글",
          content: "내용 1",
          userId: testUser.id,
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      const article2 = await prismaClient.article.create({
        data: {
          title: "두 번째 게시글",
          content: "내용 2",
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get("/articles")
        .query({ orderBy: "recent" })
        .expect(200);
      expect(response.body.list[0].id).toBe(article2.id);
    });

    it("빈 쿼리 파라미터 조회-정상??", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      await prismaClient.article.create({
        data: {
          title: "테스트 게시글",
          content: "테스트 내용",
          userId: testUser.id,
        },
      });

      const response = await request(app).get("/articles").expect(200);

      expect(response.body.list).toHaveLength(1);
      expect(response.body.list[0].title).toBe("테스트 게시글");
    });
  });

  describe("GET /articles/:id - 게시글 상세 조회 (인증 불필요)", () => {
    it("존재 게시글 조회 성공", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const article = await prismaClient.article.create({
        data: {
          title: "테스트 게시글",
          content: "테스트 내용",
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/articles/${article.id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(article.id);
      expect(response.body.title).toBe("테스트 게시글");
      expect(response.body.content).toBe("테스트 내용");
    });

    it("존재하지 않는 게시글 조회, 404 반환", async () => {
      const response = await request(app).get("/articles/99999").expect(404);

      expect(response.body).toHaveProperty("message");
    });

    it("잘못된 ID 형식으로 조회 시, 에러 반환", async () => {
      await request(app).get("/articles/invalid-id").expect(400);
    });

    it("게시글 상세 조회 시, 모든 필드 포함", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const article = await prismaClient.article.create({
        data: {
          title: "상세 조회 테스트",
          content: "상세 내용",
          image: "test-image.jpg",
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/articles/${article.id}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("content");
      expect(response.body).toHaveProperty("image");
      expect(response.body).toHaveProperty("userId");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("사용자 정보도 함께 반환되는지 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "author@example.com",
          password: "hashed_password",
          nickname: "author",
        },
      });

      const article = await prismaClient.article.create({
        data: {
          title: "작성자 정보 포함 테스트",
          content: "내용",
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/articles/${article.id}`)
        .expect(200);

      expect(response.body.userId).toBe(testUser.id);
    });
  });

  describe("게시글 API 응답 형식", () => {
    it("목록 조회 응답 형식 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      await prismaClient.article.create({
        data: {
          title: "테스트",
          content: "테스트",
          userId: testUser.id,
        },
      });

      const response = await request(app).get("/articles").expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          list: expect.any(Array),
          totalCount: expect.any(Number),
        }),
      );
    });

    it("응답 상태 코드 및 Content-Type 확인", async () => {
      await request(app)
        .get("/articles")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    it("게시글 객체의 필드 타입 검증", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      await prismaClient.article.create({
        data: {
          title: "타입 검증 테스트",
          content: "내용",
          userId: testUser.id,
        },
      });

      const response = await request(app).get("/articles").expect(200);

      const article = response.body.list[0];
      expect(typeof article.id).toBe("number");
      expect(typeof article.title).toBe("string");
      expect(typeof article.content).toBe("string");
      expect(typeof article.userId).toBe("number");
    });
  });

  describe("게시글 API 데이터 검증", () => {
    it("게시글 내용이 정확히 반환되는지 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const testTitle = "특수문자 테스트: !@#$%^&*()";
      const testContent = "개행\n테스트\n여러\n줄";

      const article = await prismaClient.article.create({
        data: {
          title: testTitle,
          content: testContent,
          userId: testUser.id,
        },
      });

      const response = await request(app)
        .get(`/articles/${article.id}`)
        .expect(200);

      expect(response.body.title).toBe(testTitle);
      expect(response.body.content).toBe(testContent);
    });

    it("삭제된 게시글은 목록에 보이지 않음", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      const article = await prismaClient.article.create({
        data: {
          title: "삭제될 게시글",
          content: "내용",
          userId: testUser.id,
        },
      });

      await prismaClient.article.delete({
        where: { id: article.id },
      });

      const response = await request(app).get("/articles").expect(200);

      expect(response.body.list).toHaveLength(0);
    });
  });

  describe("게시글 API 성능 테스트", () => {
    it("많은 게시글 조회 시 성능 확인", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });
      const articles = Array.from({ length: 50 }, (_, i) =>
        prismaClient.article.create({
          data: {
            title: `게시글 ${i + 1}`,
            content: `내용 ${i + 1}`,
            userId: testUser.id,
          },
        }),
      );

      await Promise.all(articles);

      const startTime = Date.now();
      const response = await request(app)
        .get("/articles")
        .query({ page: 1, pageSize: 20 });
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000);
      expect(response.body.totalCount).toBe(50);
    });
  });

  describe("게시글 API 에러 처리", () => {
    it("존재하지 않는 게시글 조회 시 적절한 에러 메시지 반환", async () => {
      const response = await request(app).get("/articles/99999").expect(404);

      expect(response.body).toHaveProperty("message");
      expect(typeof response.body.message).toBe("string");
    });

    it("비정상적인 쿼리 파라미터도 정상 처리", async () => {
      const response = await request(app)
        .get("/articles")
        .query({ page: "invalid", pageSize: "invalid" })
        .expect(200);

      expect(response.body).toHaveProperty("list");
    });
  });

  describe("게시글 목록 정렬 및 필터링", () => {
    it("여러 게시글 중 올바른 개수 반환", async () => {
      const testUser = await prismaClient.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          nickname: "testuser",
        },
      });

      for (let i = 1; i <= 15; i++) {
        await prismaClient.article.create({
          data: {
            title: `게시글 ${i}`,
            content: `내용 ${i}`,
            userId: testUser.id,
          },
        });
      }

      const response = await request(app)
        .get("/articles")
        .query({ page: 2, pageSize: 10 })
        .expect(200);

      expect(response.body.list).toHaveLength(5);
      expect(response.body.totalCount).toBe(15);
    });
  });
});

describe("게시글 API 통합 테스트 - 인증 필요", () => {
  let app: Express;
  let testUser: any;
  let authToken: string;
  let anotherUser: any;
  let anotherUserToken: string;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/articles", articlesRouter);
  });

  beforeEach(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});

    testUser = await prismaClient.user.create({
      data: {
        email: "testuser@example.com",
        password: "hashed_password",
        nickname: "testuser",
      },
    });
    authToken = signToken({ userId: testUser.id });
    anotherUser = await prismaClient.user.create({
      data: {
        email: "anotheruser@example.com",
        password: "hashed_password",
        nickname: "anotheruser",
      },
    });
    anotherUserToken = signToken({ userId: anotherUser.id });
  });

  afterEach(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.article.deleteMany({});
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
  });

  describe("POST /articles - 게시글 생성 (인증 필요)", () => {
    it("유효한 데이터로 게시글 생성 성공", async () => {
      const response = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "새로운 게시글",
          content: "게시글 내용",
          image: "image.jpg",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("새로운 게시글");
      expect(response.body.content).toBe("게시글 내용");
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("인증 토큰 없이 게시글 생성 시도 시 401 반환", async () => {
      const response = await request(app)
        .post("/articles")
        .send({
          title: "인증되지 않은 게시글",
          content: "내용",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("잘못된 토큰으로 게시글 생성 시도 시 401 반환", async () => {
      const response = await request(app)
        .post("/articles")
        .set("Authorization", "Bearer invalid_token")
        .send({
          title: "잘못된 토큰",
          content: "내용",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("필수 필드 누락 시 400 반환", async () => {
      const response = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "제목만 있음",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("빈 제목으로 게시글 생성 시도 시 400 반환", async () => {
      const response = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "",
          content: "내용",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("빈 내용으로 게시글 생성 시도 시 400 반환", async () => {
      const response = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "제목",
          content: "",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("생성된 게시글이 목록에 나타남", async () => {
      await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "목록 테스트 게시글",
          content: "이 게시글이 목록에 보여야 함",
        })
        .expect(201);

      const listResponse = await request(app).get("/articles").expect(200);

      expect(listResponse.body.list).toHaveLength(1);
      expect(listResponse.body.list[0].title).toBe("목록 테스트 게시글");
    });

    it("여러 사용자가 각각 게시글 생성 가능", async () => {
      await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "사용자1 게시글",
          content: "내용",
        })
        .expect(201);

      await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          title: "사용자2 게시글",
          content: "내용",
        })
        .expect(201);

      const listResponse = await request(app).get("/articles").expect(200);

      expect(listResponse.body.list).toHaveLength(2);
      expect(listResponse.body.totalCount).toBe(2);
    });
  });

  describe("PATCH /articles/:id - 게시글 수정 (인증 필요)", () => {
    let articleId: number;

    beforeEach(async () => {
      const article = await prismaClient.article.create({
        data: {
          title: "원본 게시글",
          content: "원본 내용",
          userId: testUser.id,
        },
      });
      articleId = article.id;
    });

    it("작성자가 자신의 게시글 수정 성공", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "수정된 제목",
          content: "수정된 내용",
        })
        .expect(200);

      expect(response.body.id).toBe(articleId);
      expect(response.body.title).toBe("수정된 제목");
      expect(response.body.content).toBe("수정된 내용");
    });

    it("다른 사용자가 게시글 수정 시도 시 403 반환", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .send({
          title: "해킹된 제목",
          content: "해킹된 내용",
        })
        .expect(403);

      expect(response.body).toHaveProperty("message");
    });

    it("인증 토큰 없이 게시글 수정 시도 시 401 반환", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .send({
          title: "비인증 수정",
          content: "내용",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("존재하지 않는 게시글 수정 시도 시 404 반환", async () => {
      const response = await request(app)
        .patch("/articles/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "제목",
          content: "내용",
        })
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });

    it("부분 수정 - 제목만 수정", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "새 제목만",
        })
        .expect(200);

      expect(response.body.title).toBe("새 제목만");
      expect(response.body.content).toBe("원본 내용");
    });

    it("부분 수정 - 내용만 수정", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          content: "새로운 내용만",
        })
        .expect(200);

      expect(response.body.title).toBe("원본 게시글");
      expect(response.body.content).toBe("새로운 내용만");
    });

    it("빈 제목으로 수정 시도 시 400 반환", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "",
          content: "내용",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("빈 내용으로 수정 시도 시 400 반환", async () => {
      const response = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "제목",
          content: "",
        })
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });

    it("수정된 게시글이 목록에 반영됨", async () => {
      await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "업데이트된 게시글",
          content: "업데이트된 내용",
        })
        .expect(200);

      const listResponse = await request(app).get("/articles").expect(200);

      expect(listResponse.body.list[0].title).toBe("업데이트된 게시글");
      expect(listResponse.body.list[0].content).toBe("업데이트된 내용");
    });

    it("updatedAt이 변경됨", async () => {
      const beforeResponse = await request(app)
        .get(`/articles/${articleId}`)
        .expect(200);

      const beforeUpdatedAt = new Date(beforeResponse.body.updatedAt).getTime();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const afterResponse = await request(app)
        .patch(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "시간이 지난 후 수정",
          content: "내용",
        })
        .expect(200);

      const afterUpdatedAt = new Date(afterResponse.body.updatedAt).getTime();

      expect(afterUpdatedAt).toBeGreaterThan(beforeUpdatedAt);
    });
  });

  describe("DELETE /articles/:id - 게시글 삭제 (인증 필요)", () => {
    let articleId: number;

    beforeEach(async () => {
      const article = await prismaClient.article.create({
        data: {
          title: "삭제될 게시글",
          content: "삭제될 내용",
          userId: testUser.id,
        },
      });
      articleId = article.id;
    });

    it("작성자가 자신의 게시글 삭제 성공", async () => {
      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      await request(app).get(`/articles/${articleId}`).expect(404);
    });

    it("다른 사용자가 게시글 삭제 시도 시 403 반환", async () => {
      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("message");

      await request(app).get(`/articles/${articleId}`).expect(200);
    });

    it("인증 토큰 없이 게시글 삭제 시도 시 401 반환", async () => {
      const response = await request(app)
        .delete(`/articles/${articleId}`)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("존재하지 않는 게시글 삭제 시도 시 404 반환", async () => {
      const response = await request(app)
        .delete("/articles/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });

    it("삭제된 게시글이 목록에서 제거됨", async () => {
      let listResponse = await request(app).get("/articles").expect(200);
      expect(listResponse.body.list).toHaveLength(1);

      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);
      listResponse = await request(app).get("/articles").expect(200);

      expect(listResponse.body.list).toHaveLength(0);
    });

    it("삭제된 게시글은 다시 조회 불가능", async () => {
      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);
      const response = await request(app)
        .get(`/articles/${articleId}`)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });

    it("여러 게시글 중 특정 게시글만 삭제", async () => {
      const article2 = await prismaClient.article.create({
        data: {
          title: "남을 게시글",
          content: "이건 남음",
          userId: testUser.id,
        },
      });
      await request(app)
        .delete(`/articles/${articleId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);
      const listResponse = await request(app).get("/articles").expect(200);

      expect(listResponse.body.list).toHaveLength(1);
      expect(listResponse.body.list[0].id).toBe(article2.id);
      expect(listResponse.body.list[0].title).toBe("남을 게시글");
    });

    it("삭제 후 같은 ID로 새 게시글 생성 가능", async () => {
      const originalId = articleId;
      await request(app)
        .delete(`/articles/${originalId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      const newArticleResponse = await request(app)
        .post("/articles")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "새 게시글",
          content: "새 내용",
        })
        .expect(201);
      expect(newArticleResponse.body.id).not.toBe(originalId);
    });
  });
});
