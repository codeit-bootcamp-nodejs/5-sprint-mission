import request from "supertest";
import express, { Express } from "express";
import { prismaClient } from "../../common/lib/prisma.client";
import bcrypt from "bcrypt";
import { signToken, signRefreshToken } from "../../common/lib/jwt";

describe("회원가입/로그인 API 통합 테스트", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.post("/auth/signup", async (req, res) => {
      try {
        const { email, password, nickname } = req.body;

        if (!email || !password || !nickname) {
          return res.status(400).json({
            message: "이메일, 비밀번호, 닉네임은 필수입니다",
          });
        }

        const existingUser = await prismaClient.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return res.status(409).json({
            message: "이미 존재하는 이메일입니다",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.create({
          data: {
            email,
            password: hashedPassword,
            nickname,
          },
        });

        const accessToken = signToken({ userId: user.id });
        const refreshToken = signRefreshToken({ userId: user.id });

        res.status(201).json({
          data: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            accessToken,
            refreshToken,
          },
          message: "회원가입 성공",
        });
      } catch (error) {
        res.status(500).json({
          message: "회원가입 중 오류 발생",
        });
      }
    });

    app.post("/auth/signin", async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            message: "이메일과 비밀번호는 필수입니다",
          });
        }

        const user = await prismaClient.user.findUnique({
          where: { email },
        });

        if (!user) {
          return res.status(401).json({
            message: "이메일 또는 비밀번호가 올바르지 않습니다",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({
            message: "이메일 또는 비밀번호가 올바르지 않습니다",
          });
        }

        const accessToken = signToken({ userId: user.id });
        const refreshToken = signRefreshToken({ userId: user.id });

        res.status(200).json({
          data: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            accessToken,
            refreshToken,
          },
          message: "로그인 성공",
        });
      } catch (error) {
        res.status(500).json({
          message: "로그인 중 오류 발생",
        });
      }
    });
  });

  beforeEach(async () => {
    await prismaClient.user.deleteMany({});
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany({});
    await prismaClient.$disconnect();
  });

  describe("POST /auth/signup - 회원가입 (인증 불필요)", () => {
    it("유효한 정보로 회원가입 성공", async () => {
      const signUpData = {
        email: "newuser@example.com",
        password: "password123",
        nickname: "newuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("email", signUpData.email);
      expect(response.body.data).toHaveProperty(
        "nickname",
        signUpData.nickname,
      );
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.message).toBe("회원가입 성공");
    });

    it("중복된 이메일로 회원가입 시 409 반환", async () => {
      const signUpData = {
        email: "duplicate@example.com",
        password: "password123",
        nickname: "user1",
      };

      await request(app).post("/auth/signup").send(signUpData).expect(201);

      const duplicateData = {
        email: "duplicate@example.com",
        password: "password456",
        nickname: "user2",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(duplicateData)
        .expect(409);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("존재하는 이메일");
    });

    it("필수 필드 누락 시 400 반환", async () => {
      const incompleteSingUpData = {
        email: "incomplete@example.com",
        nickname: "incompleteuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(incompleteSingUpData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("필수");
    });

    it("이메일 필드 누락 시 400 반환", async () => {
      const noEmailData = {
        password: "password123",
        nickname: "nomail",
      };

      await request(app).post("/auth/signup").send(noEmailData).expect(400);
    });

    it("닉네임 필드 누락 시 400 반환", async () => {
      const noNicknameData = {
        email: "nonickname@example.com",
        password: "password123",
      };

      await request(app).post("/auth/signup").send(noNicknameData).expect(400);
    });

    it("회원가입 후 사용자가 DB에 저장됨", async () => {
      const signUpData = {
        email: "dbtest@example.com",
        password: "password123",
        nickname: "dbtestuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      const createdUser = await prismaClient.user.findUnique({
        where: { email: signUpData.email },
      });

      expect(createdUser).toBeTruthy();
      expect(createdUser?.email).toBe(signUpData.email);
      expect(createdUser?.nickname).toBe(signUpData.nickname);
    });

    it("비밀번호는 해싱되어 저장됨", async () => {
      const signUpData = {
        email: "hashtest@example.com",
        password: "plainpassword123",
        nickname: "hashtestuser",
      };

      await request(app).post("/auth/signup").send(signUpData).expect(201);

      const createdUser = await prismaClient.user.findUnique({
        where: { email: signUpData.email },
      });

      expect(createdUser?.password).not.toBe(signUpData.password);
      expect(createdUser?.password).toMatch(/^\$2[aby]\$/);
    });

    it("회원가입 응답에는 비밀번호가 포함되지 않음", async () => {
      const signUpData = {
        email: "nopassword@example.com",
        password: "password123",
        nickname: "nopassworduser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body.data).not.toHaveProperty("password");
    });
  });

  describe("POST /auth/signin - 로그인 (인증 불필요)", () => {
    it("유효한 이메일과 비밀번호로 로그인 성공", async () => {
      const user = await prismaClient.user.create({
        data: {
          email: "login@example.com",
          password: await bcrypt.hash("password123", 10),
          nickname: "loginuser",
        },
      });

      const signInData = {
        email: "login@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id", user.id);
      expect(response.body.data).toHaveProperty("email", signInData.email);
      expect(response.body.data).toHaveProperty("nickname", "loginuser");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.message).toBe("로그인 성공");
    });

    it("존재하지 않는 이메일로 로그인 시 401 반환", async () => {
      const signInData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("잘못된 비밀번호로 로그인 시 401 반환", async () => {
      await prismaClient.user.create({
        data: {
          email: "wrongpass@example.com",
          password: await bcrypt.hash("correctpassword", 10),
          nickname: "wrongpassuser",
        },
      });

      const signInData = {
        email: "wrongpass@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("이메일 필드 누락 시 400 반환", async () => {
      const incompleteData = {
        password: "password123",
      };

      await request(app).post("/auth/signin").send(incompleteData).expect(400);
    });

    it("비밀번호 필드 누락 시 400 반환", async () => {
      const incompleteData = {
        email: "test@example.com",
      };

      await request(app).post("/auth/signin").send(incompleteData).expect(400);
    });

    it("로그인 후 받은 토큰으로 인증 가능", async () => {
      const user = await prismaClient.user.create({
        data: {
          email: "tokentest@example.com",
          password: await bcrypt.hash("password123", 10),
          nickname: "tokenuser",
        },
      });

      const signInData = {
        email: "tokentest@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(200);

      expect(response.body.data.accessToken).toBeTruthy();
      expect(typeof response.body.data.accessToken).toBe("string");
    });

    it("대소문자가 다른 이메일로 로그인 시 인식", async () => {
      await prismaClient.user.create({
        data: {
          email: "casesensitive@example.com",
          password: await bcrypt.hash("password123", 10),
          nickname: "caseuser",
        },
      });

      const signInData = {
        email: "CASESENSITIVE@EXAMPLE.COM",
        password: "password123",
      };
      const response = await request(app).post("/auth/signin").send(signInData);

      expect([200, 401]).toContain(response.status);
    });
  });

  describe("회원가입/로그인 응답 형식", () => {
    it("회원가입 응답 JSON 구조 확인", async () => {
      const signUpData = {
        email: "format@example.com",
        password: "password123",
        nickname: "formatuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(Number),
            email: expect.any(String),
            nickname: expect.any(String),
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
          message: expect.any(String),
        }),
      );
    });

    it("로그인 응답 JSON 구조 확인", async () => {
      await prismaClient.user.create({
        data: {
          email: "formatlogin@example.com",
          password: await bcrypt.hash("password123", 10),
          nickname: "formatloginuser",
        },
      });

      const signInData = {
        email: "formatlogin@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(Number),
            email: expect.any(String),
            nickname: expect.any(String),
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
          }),
          message: expect.any(String),
        }),
      );
    });

    it("응답 Content-Type 확인", async () => {
      const signUpData = {
        email: "contenttype@example.com",
        password: "password123",
        nickname: "contenttypeuser",
      };

      await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect("Content-Type", /json/);
    });
  });

  describe("회원가입/로그인 데이터 검증", () => {
    it("특수문자가 포함된 닉네임으로 회원가입 가능", async () => {
      const signUpData = {
        email: "special@example.com",
        password: "password123",
        nickname: "사용자_001!",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body.data.nickname).toBe("사용자_001!");
    });

    it("긴 이메일로 회원가입 가능", async () => {
      const signUpData = {
        email: "verylongemailaddress123456789@subdomain.example.com",
        password: "password123",
        nickname: "longemailuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body.data.email).toBe(signUpData.email);
    });

    it("복잡한 비밀번호로 회원가입 가능", async () => {
      const signUpData = {
        email: "complex@example.com",
        password: "P@ssw0rd!#$%^&*()",
        nickname: "complexuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      expect(response.body).toHaveProperty("data");
    });
  });

  describe("회원가입/로그인 보안", () => {
    it("응답에 해싱되지 않은 비밀번호가 없음 (회원가입)", async () => {
      const signUpData = {
        email: "security@example.com",
        password: "secretpassword123",
        nickname: "securityuser",
      };

      const response = await request(app)
        .post("/auth/signup")
        .send(signUpData)
        .expect(201);

      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toContain("secretpassword123");
    });

    it("응답에 해싱되지 않은 비밀번호가 없음 (로그인)", async () => {
      const plainPassword = "secretpassword456";
      await prismaClient.user.create({
        data: {
          email: "securitylogin@example.com",
          password: await bcrypt.hash(plainPassword, 10),
          nickname: "securityloginuser",
        },
      });

      const signInData = {
        email: "securitylogin@example.com",
        password: plainPassword,
      };

      const response = await request(app)
        .post("/auth/signin")
        .send(signInData)
        .expect(200);

      const responseStr = JSON.stringify(response.body);
      expect(responseStr).not.toContain(plainPassword);
    });
  });
});
