import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";
import { resolve } from "node:dns";

/**
 * 인증 API 통합 테스트 - CQRS 아키텍처 기반
 * 
 * 이 테스트는 실제 HTTP 요청을 통해 회원가입과 로그인 기능을 검증합니다.
 * - 데이터베이스와의 실제 연동
 * - Command/Query 분리 아키텍처 검증
 * - 전체 요청-응답 플로우 테스트
 */
describe("인증 API 통합 테스트 - 회원가입 및 로그인", () => {
    const prisma = new PrismaClient();
    const timestamp = Date.now();
    const testUser = {
        email: `integration-test-${timestamp}@example.com`,
        nickname: `integration-user-${timestamp}`,
        password: "Test123!!",
    };

    afterAll(async () => {
        // 테스트 유저 정리
        try {
            await prisma.user.deleteMany({
                where: { email: testUser.email }
            });
        } catch (error) {
            console.error("테스트 정리 중 오류:", error);
        }
        await prisma.$disconnect();
    });

    /**
     * 회원가입 통합 테스트
     * Command Service를 통한 유저 생성 검증
     */
    describe("POST /users/signUp - 회원가입", () => {
        describe("회원가입 성공 시나리오", () => {
            it("유효한 이메일, 닉네임, 비밀번호로 회원가입에 성공해야 한다", async () => {
                // When: 회원가입 요청
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(testUser);

                // Then: 201 Created 응답과 유저 정보 반환
                expect(response.status).toBe(201);
                expect(response.body).toBeDefined();
                expect(response.body.email).toBe(testUser.email);
                expect(response.body.nickname).toBe(testUser.nickname);
                expect(response.body).not.toHaveProperty("password"); // 민감정보 필터링 검증
                expect(response.body).not.toHaveProperty("refreshToken"); // 민감정보 필터링 검증
                expect(response.body.id).toBeDefined();
                expect(response.body.createdAt).toBeDefined();
                expect(response.body.updatedAt).toBeDefined();
            });

            it("회원가입 시 비밀번호가 해시되어 저장되어야 한다", async () => {
                // Given: 고유한 테스트 유저
                const uniqueUser = {
                    email: `hash-test-${Date.now()}@example.com`,
                    nickname: `hash-user-${Date.now()}`,
                    password: "PlainPassword123!",
                };

                // When: 회원가입 요청
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(uniqueUser);

                // Then: DB에서 비밀번호가 해시되어 저장되었는지 확인
                expect(response.status).toBe(201);

                const savedUser = await prisma.user.findUnique({
                    where: { email: uniqueUser.email }
                });

                expect(savedUser).toBeDefined();
                expect(savedUser!.password).not.toBe(uniqueUser.password); // 평문과 다름
                expect(savedUser!.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt 해시 패턴

                // 정리
                await prisma.user.delete({ where: { email: uniqueUser.email } });
            });

            it("회원가입 시 refreshToken이 생성되어야 한다", async () => {
                // Given: 고유한 테스트 유저
                const uniqueUser = {
                    email: `token-test-${Date.now()}@example.com`,
                    nickname: `token-user-${Date.now()}`,
                    password: "TokenTest123!",
                };

                // When: 회원가입 요청
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(uniqueUser);

                // Then: DB에 refreshToken이 저장되어 있어야 함
                expect(response.status).toBe(201);

                const savedUser = await prisma.user.findUnique({
                    where: { email: uniqueUser.email }
                });

                expect(savedUser).toBeDefined();
                expect(savedUser!.refreshToken).toBeDefined();
                expect(savedUser!.refreshToken).not.toBeNull();
                expect(savedUser!.refreshToken!.length).toBeGreaterThan(0);

                // 정리
                await prisma.user.delete({ where: { email: uniqueUser.email } });
            });
        });

        describe("회원가입 실패 시나리오", () => {
            it("중복된 이메일로 회원가입 시도 시 실패해야 한다", async () => {
                // Given: 이미 가입된 유저
                const duplicateUser = {
                    email: testUser.email,
                    nickname: "different-nickname",
                    password: "Test123!!",
                };

                // When: 동일한 이메일로 회원가입 시도
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(duplicateUser);

                // Then: 중복 에러 발생
                expect(response.status).toBe(500); // 또는 409 Conflict
            });

            it("필수 필드 누락 시 실패해야 한다", async () => {
                // Given: 이메일이 없는 요청
                const invalidUser = {
                    nickname: "test-user",
                    password: "Test123!!",
                };

                // When: 회원가입 시도
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(invalidUser);

                // Then: 유효성 검증 에러
                expect(response.status).toBe(400);
            });

            it("잘못된 이메일 형식으로 실패해야 한다", async () => {
                // Given: 잘못된 이메일 형식
                const invalidUser = {
                    email: "invalid-email-format",
                    nickname: "test-user",
                    password: "Test123!!",
                };

                // When: 회원가입 시도
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(invalidUser);

                // Then: 유효성 검증 에러
                expect(response.status).toBe(400);
            });
        });
    });

    /**
     * 로그인 통합 테스트
     * Command Service를 통한 인증 및 토큰 발급 검증
     */
    describe("POST /users/signIn - 로그인", () => {
        describe("로그인 성공 시나리오", () => {
            it("유효한 이메일과 비밀번호로 로그인에 성공하고 토큰을 받아야 한다", async () => {
                // When: 로그인 요청
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send({
                        email: testUser.email,
                        password: testUser.password,
                    });

                // Then: 200 OK 응답과 accessToken 반환
                expect(response.status).toBe(200);
                expect(response.body).toBeDefined();
                expect(response.body.accessToken).toBeDefined();
                expect(typeof response.body.accessToken).toBe("string");
                expect(response.body.accessToken.length).toBeGreaterThan(0);
            });
            it("로그인 시 refreshToken이 쿠키에 설정되어야 한다", async () => {
                // When: 로그인 요청
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send({
                        email: testUser.email,
                        password: testUser.password,
                    });

                // Then: refreshToken이 httpOnly 쿠키로 설정됨
                expect(response.status).toBe(200);
                const setCookieHeader = response.headers["set-cookie"];
                const cookies = Array.isArray(setCookieHeader)
                    ? setCookieHeader
                    : setCookieHeader
                        ? [setCookieHeader]
                        : [];

                expect(cookies.length).toBeGreaterThan(0);

                const refreshTokenCookie = cookies.find((cookie) =>
                    cookie.startsWith("refreshToken=")
                );

                expect(refreshTokenCookie).toBeDefined();
                expect(refreshTokenCookie).toContain("HttpOnly");
            });

            it("로그인 성공 시 데이터베이스의 refreshToken이 갱신되어야 한다", async () => {
                // Given: 로그인 전 refreshToken 확인
                const userBeforeLogin = await prisma.user.findUnique({
                    where: { email: testUser.email }
                });

                // When: 로그인 요청
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send({
                        email: testUser.email,
                        password: testUser.password,
                    });

                // Then: refreshToken이 갱신됨
                await new Promise(resolve => setTimeout(resolve, 1000));
                const userAfterLogin = await prisma.user.findUnique({
                    where: { email: testUser.email }
                });


                const oldRefreshToken = userBeforeLogin!.refreshToken;
                const newRefreshToken = userAfterLogin!.refreshToken;

                expect(response.status).toBe(200);
                expect(newRefreshToken).toBeDefined();
                expect(newRefreshToken).not.toBe(oldRefreshToken);
            });

            it("발급된 accessToken으로 인증된 엔드포인트에 접근할 수 있어야 한다", async () => {
                // Given: 로그인하여 토큰 발급
                const loginResponse = await request(global.testApp)
                    .post("/users/signIn")
                    .send({
                        email: testUser.email,
                        password: testUser.password,
                    });

                const accessToken = loginResponse.body.accessToken;

                // When: 인증이 필요한 엔드포인트 호출
                const response = await request(global.testApp)
                    .get("/users/me")
                    .set("Authorization", `Bearer ${accessToken}`);

                // Then: 성공적으로 접근
                expect(response.status).toBe(200);
                expect(response.body.email).toBe(testUser.email);
                expect(response.body.nickname).toBe(testUser.nickname);
            });
        });

        describe("로그인 실패 시나리오", () => {
            it("존재하지 않는 이메일로 로그인 시도 시 실패해야 한다", async () => {
                // Given: 존재하지 않는 유저 정보
                const nonExistentUser = {
                    email: "nonexistent@example.com",
                    password: "password123",
                };

                // When: 로그인 시도
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send(nonExistentUser);

                // Then: 404 Not Found
                expect(response.status).toBe(404);
            });

            it("잘못된 비밀번호로 로그인 시도 시 실패해야 한다", async () => {
                // Given: 올바른 이메일, 틀린 비밀번호
                const wrongPasswordUser = {
                    email: testUser.email,
                    password: "WrongPassword123!",
                };

                // When: 로그인 시도
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send(wrongPasswordUser);

                // Then: 401 Unauthorized
                expect(response.status).toBe(401);
            });

            it("필수 필드 누락 시 실패해야 한다", async () => {
                // Given: 비밀번호 없는 요청
                const invalidRequest = {
                    email: testUser.email,
                };

                // When: 로그인 시도
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send(invalidRequest);

                // Then: 400 Bad Request
                expect(response.status).toBe(400);
            });
        });
    });

    /**
     * 회원가입 → 로그인 통합 플로우 테스트
     */
    describe("회원가입 → 로그인 통합 플로우", () => {
        it("새 유저 회원가입 후 즉시 로그인할 수 있어야 한다", async () => {
            // Given: 새로운 유저 정보
            const newUser = {
                email: `flow-test-${Date.now()}@example.com`,
                nickname: `flow-user-${Date.now()}`,
                password: "FlowTest123!",
            };

            // When: 1. 회원가입
            const signUpResponse = await request(global.testApp)
                .post("/users/signUp")
                .send(newUser);

            expect(signUpResponse.status).toBe(201);
            expect(signUpResponse.body.email).toBe(newUser.email);

            // When: 2. 즉시 로그인
            const signInResponse = await request(global.testApp)
                .post("/users/signIn")
                .send({
                    email: newUser.email,
                    password: newUser.password,
                });

            // Then: 로그인 성공
            expect(signInResponse.status).toBe(200);
            expect(signInResponse.body.accessToken).toBeDefined();

            // When: 3. 발급받은 토큰으로 내 정보 조회
            const meResponse = await request(global.testApp)
                .get("/users/me")
                .set("Authorization", `Bearer ${signInResponse.body.accessToken}`);

            // Then: 회원가입한 정보와 일치
            expect(meResponse.status).toBe(200);
            expect(meResponse.body.email).toBe(newUser.email);
            expect(meResponse.body.nickname).toBe(newUser.nickname);

            // 정리
            await prisma.user.delete({ where: { email: newUser.email } });
        });

        it("여러 번 로그인 시 매번 새로운 토큰이 발급되어야 한다", async () => {
            // When: 첫 번째 로그인
            const firstLogin = await request(global.testApp)
                .post("/users/signIn")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(firstLogin.status).toBe(200);
            const firstAccessToken = firstLogin.body.accessToken;

            // 첫 번째 로그인이 완전히 완료될 때까지 대기 (100ms 이상)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // When: 두 번째 로그인 (명시적으로 대기 후 실행)
            const secondLogin = await request(global.testApp)
                .post("/users/signIn")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(secondLogin.status).toBe(200);
            const secondAccessToken = secondLogin.body.accessToken;


            // Then: 두 토큰이 달라야 함
            expect(firstAccessToken).toBeDefined();
            expect(secondAccessToken).toBeDefined();
            expect(firstAccessToken).not.toBe(secondAccessToken);

            // Then: 둘 다 유효한 토큰이어야 함
            const firstTokenCheck = await request(global.testApp)
                .get("/users/me")
                .set("Authorization", `Bearer ${firstAccessToken}`);

            const secondTokenCheck = await request(global.testApp)
                .get("/users/me")
                .set("Authorization", `Bearer ${secondAccessToken}`);

            expect(firstTokenCheck.status).toBe(200);
            expect(secondTokenCheck.status).toBe(200);
        });
    });
});