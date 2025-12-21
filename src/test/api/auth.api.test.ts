import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";

describe("인증 API 통합 테스트", () => {
    const prisma = new PrismaClient();
    const testUser = {
        email: `test-${Date.now()}@gmail.com`,
        nickname: "test-user",
        password: "Test123!!",
    };

    afterAll(async () => {
        await prisma.user.delete({ where: { email: testUser.email } });
        await prisma.$disconnect();
    });


    describe("회원가입 API 테스트", () => {
        describe("회원가입 성공", () => {
            test("올바른 회원가입 형식 => 회원가입 성공!", async () => {
                const response = await request(global.testApp)
                    .post("/users/signUp")
                    .send(testUser);
                expect(response.status).toBe(201);
                expect(response).toBeDefined();
            });
        })

    });


    describe("로그인 API 테스트", () => {
        describe("로그인 성공", () => {
            test("이메일과 비밀번호로 로그인 성공했습니다.", async () => {
                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send({
                        email: testUser.email,
                        password: testUser.password,
                    });

                expect(response.status).toBe(200);
            });
        })


        describe("로그인 실패", () => {
            test("이메일이나 비밀번호가 틀렸습니다.", async () => {
                const user = {
                    email: "doesntexist@gmail.com",
                    password: "userdoesntexist"
                };

                const response = await request(global.testApp)
                    .post("/users/signIn")
                    .send(user);

                expect(response.status).toBe(404);
            });
        })
    });


});