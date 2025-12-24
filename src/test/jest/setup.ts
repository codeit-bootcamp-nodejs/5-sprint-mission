import { Application } from "express";
import { Server } from "http";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { DependencyInjector } from "../../dependency-injector";

declare global {
    var testApp: Application;
    var testServer: Server;
    var testAccessToken: string;
    var testUser: { email: string; nickname: string; password: string };
}

beforeAll(async () => {
    // 서버 생성
    if (!global.testServer) {
        const { httpServer } = DependencyInjector();
        global.testApp = httpServer.server;
        global.testServer = httpServer.defaultHttpServer;
        httpServer.run();
    }

    // (POST /users/signUp) 유저 회원 가입
    // (POST /users/signIn) access token 토큰 발급 받아서 변수에 저장하기
    const uniqueSuffix = Date.now();
    const user = {
        email: `test-${uniqueSuffix}@example.com`,
        nickname: `tester-${uniqueSuffix}`,
        password: "Test123!!",
    };

    global.testUser = user;

    // 회원가입 시도 (이미 존재해도 다음 단계 진행)
    try {
        await request(global.testApp).post("/users/signUp").send(user);
    } catch (e) {
        // ignore signup errors in setup
    }

    // 로그인 후 액세스 토큰 저장
    const signInRes = await request(global.testApp)
        .post("/users/signIn")
        .send({ email: user.email, password: user.password });

    if (signInRes.status !== 200 || !signInRes.body?.accessToken) {
        throw new Error("Failed to obtain access token during test setup");
    }

    global.testAccessToken = signInRes.body.accessToken;
});

afterAll(async () => {
    // 테스트 유저 삭제하기
    try {
        const prisma = new PrismaClient();
        if (global.testUser?.email) {
            await prisma.user.delete({ where: { email: global.testUser.email } });
        }
        await prisma.$disconnect();
    } catch (e) {
        // ignore cleanup errors
    }

    if (global.testServer) {
        global.testServer.close();
    }
});
