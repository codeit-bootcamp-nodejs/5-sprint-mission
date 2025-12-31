import request from 'supertest'
import bcrypt from 'bcrypt'
import { createApp } from "../app"
import { prismaClient } from "../lib/prismaClient";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '../lib/constants';

const app = createApp()

beforeAll(async () => {
  await prismaClient.$connect();
})

beforeEach(async () => {
  await prismaClient.$executeRaw`TRUNCATE "User" RESTRATE IDENTITY CASCADE;`
})

afterAll(async () => {
  await prismaClient.$disconnect();
})

describe("로그인/회원가입 통합테스트", () => {
  const testUser = {
    email: 'user@test.com',
    nickname: 'tt',
    password: '1111',
    image: null as string | null
  }

  it('회원가입 성공시 201과 유저 정보 반환', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      email: testUser.email,
      nickname: testUser.nickname,
      image: null,
    });
    expect(res.body).not.toHaveProperty('password');

    const saved = await prismaClient.user.findUnique({ where: { email: testUser.email } })
    expect(saved?.password).toBeDefined();
    expect(saved?.password).not.toBe(testUser.password);
  });

  it('이미 존재하는 이메일로 회원가입 시 400', async () => {
    await prismaClient.user.create({
      data: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: await bcrypt.hash(testUser.password, 10),
        image: testUser.image,
      }
    })

    const res = await request(app).post('/auth/register').send(testUser)
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ message: 'User already exists' })
  })

  it('로그인 성공 시 200, 토큰 세팅', async () => {
    await prismaClient.user.create({
      data: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: await bcrypt.hash(testUser.password, 10),
        image: testUser.image,
      }
    });

    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.status).toBe(200);
    const cookies = (res.get('Set-Cookie') ?? []).join(';');
    expect(cookies).toContain(`${ACCESS_TOKEN_COOKIE_NAME}=`)
    expect(cookies).toContain(`${REFRESH_TOKEN_COOKIE_NAME}=`);
  });

  it('잘못된 비밀번호로 로그인시 400', async () => {
    await prismaClient.user.create({
      data: {
        email: testUser.email,
        nickname: testUser.nickname,
        password: await bcrypt.hash(testUser.password, 10),
        image: testUser.image,
      }
    })

    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: 'wrong',
    })

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ message: 'Invalid credentials' })
  })
})

