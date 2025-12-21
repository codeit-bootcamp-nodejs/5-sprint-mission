import { createUserService, UserServiceType } from "../../02-domain/service/user.service";
import { IUserRepository } from "../../02-domain/port/repositories/I.user.repository";
import { IProductRepository } from "../../02-domain/port/repositories/I.product.repository";
import { AuthenticatorType } from "../../shared/authenticator/authenticator";
import { INotificationEventBus } from "../../shared/eventbus/ports/I.notification.eventbus";
import { UserEntity, PersistedUserEntity } from "../../02-domain/entity/user.entity";
import { PersistedProduct } from "../../02-domain/entity/product";
import { UserSignUpDto, UserSignInDto, UserEditDto } from "../../01-inbound/request/user.request";
import { BusinessException, BusinessExceptionType } from "../../shared/exception/exception";

describe("User Service Tests", () => {
    let userService: UserServiceType;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockProductRepository: jest.Mocked<IProductRepository>;
    let mockAuth: jest.Mocked<AuthenticatorType>;
    let mockNotificationEventBus: jest.Mocked<INotificationEventBus>;

    beforeEach(() => {
        // Mock UserRepository
        mockUserRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
        } as any;

        // Mock ProductRepository
        mockProductRepository = {
            findByUserId: jest.fn(),
        } as any;

        // Mock Authenticator
        mockAuth = {
            createToken: jest.fn(),
            createHashPassword: jest.fn(),
            verifyPassword: jest.fn(),
            filterSensitiveUserData: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
            checkAuthWs: jest.fn(),
            refreshAccessToken: jest.fn(),
        } as any;

        // Mock NotificationEventBus
        mockNotificationEventBus = {
            subscribe: jest.fn(),
            subscribeAll: jest.fn(),
            publish: jest.fn(),
            publishAll: jest.fn(),
        } as any;

        userService = createUserService(
            mockUserRepository,
            mockProductRepository,
            mockAuth,
            mockNotificationEventBus
        );
    });

    describe("createUser", () => {
        it("should successfully create a new user", async () => {
            // Given: 유저 생성 요청 데이터
            const signUpDto: UserSignUpDto = {
                email: "test@example.com",
                nickname: "testuser",
                password: "password123",
            };

            const refreshToken = "refresh_token_123";
            const hashPassword = "hashed_password";
            const savedUser: PersistedUserEntity = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                password: hashPassword,
                refreshToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const filteredUser = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            };

            mockAuth.createToken.mockReturnValue(refreshToken);
            mockAuth.createHashPassword.mockResolvedValue(hashPassword);
            mockUserRepository.save.mockResolvedValue(savedUser);
            mockAuth.filterSensitiveUserData.mockReturnValue(filteredUser);

            // When: 유저 생성
            const result = await userService.createUser(signUpDto);

            // Then: 유저가 생성되고 민감정보가 필터링된다
            expect(mockAuth.createToken).toHaveBeenCalledWith(
                { email: signUpDto.email },
                "refresh"
            );
            expect(mockAuth.createHashPassword).toHaveBeenCalledWith(signUpDto.password);
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: signUpDto.email,
                    nickname: signUpDto.nickname,
                    password: hashPassword,
                    refreshToken,
                })
            );
            expect(mockAuth.filterSensitiveUserData).toHaveBeenCalledWith(savedUser);
            expect(result).toEqual(filteredUser);
            expect(result).not.toHaveProperty("password");
            expect(result).not.toHaveProperty("refreshToken");
        });

        it("should hash password before saving user", async () => {
            // Given: 평문 비밀번호가 포함된 유저 생성 요청
            const signUpDto: UserSignUpDto = {
                email: "test@example.com",
                nickname: "testuser",
                password: "plainTextPassword",
            };

            const hashedPassword = "$2b$10$hashedPasswordValue";
            mockAuth.createHashPassword.mockResolvedValue(hashedPassword);
            mockAuth.createToken.mockReturnValue("refresh_token");
            mockUserRepository.save.mockResolvedValue({
                id: "user-1",
                email: signUpDto.email,
                nickname: signUpDto.nickname,
                password: hashedPassword,
                refreshToken: "refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockAuth.filterSensitiveUserData.mockReturnValue({});

            // When: 유저 생성
            await userService.createUser(signUpDto);

            // Then: 비밀번호가 해시된다
            expect(mockAuth.createHashPassword).toHaveBeenCalledWith("plainTextPassword");
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    password: hashedPassword,
                })
            );
        });

        it("should generate refresh token during user creation", async () => {
            // Given: 유저 생성 요청
            const signUpDto: UserSignUpDto = {
                email: "test@example.com",
                nickname: "testuser",
                password: "password123",
            };

            const generatedRefreshToken = "generated_refresh_token_abc123";
            mockAuth.createToken.mockReturnValue(generatedRefreshToken);
            mockAuth.createHashPassword.mockResolvedValue("hashed");
            mockUserRepository.save.mockResolvedValue({
                id: "user-1",
                email: signUpDto.email,
                nickname: signUpDto.nickname,
                password: "hashed",
                refreshToken: generatedRefreshToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockAuth.filterSensitiveUserData.mockReturnValue({});

            // When: 유저 생성
            await userService.createUser(signUpDto);

            // Then: 리프레시 토큰이 생성되고 저장된다
            expect(mockAuth.createToken).toHaveBeenCalledWith(
                { email: signUpDto.email },
                "refresh"
            );
            expect(mockUserRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    refreshToken: generatedRefreshToken,
                })
            );
        });
    });

    describe("getTokens (Sign In)", () => {
        it("should successfully sign in and return tokens", async () => {
            // Given: 로그인 요청 데이터
            const signInDto: UserSignInDto = {
                email: "test@example.com",
                password: "password123",
            };

            const savedUser: PersistedUserEntity = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                password: "hashed_password",
                refreshToken: "old_refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const accessToken = "access_token_abc";
            const refreshToken = "refresh_token_xyz";

            mockUserRepository.findByEmail.mockResolvedValue(savedUser);
            mockAuth.verifyPassword.mockResolvedValue(undefined);
            mockAuth.createToken
                .mockReturnValueOnce(accessToken)
                .mockReturnValueOnce(refreshToken);
            mockUserRepository.update.mockResolvedValue({
                ...savedUser,
                refreshToken,
            });

            // When: 로그인
            const result = await userService.getTokens(signInDto);

            // Then: 토큰이 발급되고 리프레시 토큰이 갱신된다
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
            expect(mockAuth.verifyPassword).toHaveBeenCalledWith(
                signInDto.password,
                savedUser.password
            );
            expect(mockAuth.createToken).toHaveBeenCalledWith(savedUser);
            expect(mockAuth.createToken).toHaveBeenCalledWith(savedUser, "refresh");
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                savedUser,
                expect.objectContaining({
                    refreshToken,
                })
            );
            expect(result).toEqual({
                accessToken,
                refreshToken,
            });
        });

        it("should throw error when user not found", async () => {
            // Given: 존재하지 않는 유저의 로그인 요청
            const signInDto: UserSignInDto = {
                email: "nonexistent@example.com",
                password: "password123",
            };

            // When & Then: 데이터 없음 에러가 발생한다
            await expect(userService.getTokens(signInDto)).rejects.toEqual(
                BusinessException({
                    type: BusinessExceptionType.DATA_NOT_FOUND,
                })
            );
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
            expect(mockAuth.verifyPassword).not.toHaveBeenCalled();
        });

        it("should throw error when password is incorrect", async () => {
            // Given: 잘못된 비밀번호로 로그인 시도
            const signInDto: UserSignInDto = {
                email: "test@example.com",
                password: "wrongPassword",
            };

            const savedUser: PersistedUserEntity = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                password: "hashed_correct_password",
                refreshToken: "refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockUserRepository.findByEmail.mockResolvedValue(savedUser);
            mockAuth.verifyPassword.mockRejectedValue(
                BusinessException({
                    type: BusinessExceptionType.UNAUTORIZED_REQUEST,
                })
            );

            // When & Then: 인증 에러가 발생한다
            await expect(userService.getTokens(signInDto)).rejects.toEqual(
                BusinessException({
                    type: BusinessExceptionType.UNAUTORIZED_REQUEST,
                })
            );
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
            expect(mockAuth.verifyPassword).toHaveBeenCalledWith(
                signInDto.password,
                savedUser.password
            );
            expect(mockAuth.createToken).not.toHaveBeenCalled();
        });

        it("should update refresh token in database after sign in", async () => {
            // Given: 로그인 요청
            const signInDto: UserSignInDto = {
                email: "test@example.com",
                password: "password123",
            };

            const savedUser: PersistedUserEntity = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                password: "hashed_password",
                refreshToken: "old_refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newRefreshToken = "new_refresh_token_123";
            mockUserRepository.findByEmail.mockResolvedValue(savedUser);
            mockAuth.verifyPassword.mockResolvedValue(undefined);
            mockAuth.createToken
                .mockReturnValueOnce("access_token")
                .mockReturnValueOnce(newRefreshToken);
            mockUserRepository.update.mockResolvedValue({
                ...savedUser,
                refreshToken: newRefreshToken,
            });

            // When: 로그인
            await userService.getTokens(signInDto);

            // Then: 데이터베이스의 리프레시 토큰이 갱신된다
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                savedUser,
                expect.objectContaining({
                    email: savedUser.email,
                    nickname: savedUser.nickname,
                    password: savedUser.password,
                    refreshToken: newRefreshToken,
                })
            );
        });
    });

    describe("getInfo", () => {
        it("should return user information without sensitive data", async () => {
            // Given: 유저 ID
            const userId = "user-1";
            const savedUser: PersistedUserEntity = {
                id: userId,
                email: "test@example.com",
                nickname: "testuser",
                password: "hashed_password",
                refreshToken: "refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const filteredUser = {
                id: userId,
                email: "test@example.com",
                nickname: "testuser",
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            };

            mockUserRepository.findById.mockResolvedValue(savedUser);
            mockAuth.filterSensitiveUserData.mockReturnValue(filteredUser);

            // When: 유저 정보 조회
            const result = await userService.getInfo(userId);

            // Then: 민감정보가 제외된 유저 정보가 반환된다
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockAuth.filterSensitiveUserData).toHaveBeenCalledWith(savedUser);
            expect(result).toEqual(filteredUser);
            expect(result).not.toHaveProperty("password");
            expect(result).not.toHaveProperty("refreshToken");
        });

        it("should call repository with correct user id", async () => {
            // Given: 특정 유저 ID
            const userId = "specific-user-123";
            mockUserRepository.findById.mockResolvedValue({
                id: userId,
                email: "user@example.com",
                nickname: "user",
                password: "hash",
                refreshToken: "token",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            mockAuth.filterSensitiveUserData.mockReturnValue({});

            // When: 유저 정보 조회
            await userService.getInfo(userId);

            // Then: 올바른 ID로 repository가 호출된다
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe("updateUser", () => {
        it("should successfully update user information", async () => {
            // Given: 유저 업데이트 요청
            const userId = "user-1";

            const userEditDto: UserEditDto = {
                email: "updated@example.com",
                nickname: "updateduser",
                password: "newPassword123",
                userId: userId

            }

            const foundUser: PersistedUserEntity = {
                id: "user-1",
                email: "old@example.com",
                nickname: "olduser",
                password: "old_hashed_password",
                refreshToken: "old_refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const hashedPassword = "new_hashed_password";
            const newRefreshToken = "new_refresh_token";
            const updatedUser: PersistedUserEntity = {
                ...foundUser,
                email: userEditDto.email,
                nickname: userEditDto.nickname,
                password: hashedPassword,
                refreshToken: newRefreshToken,
            };

            const filteredUser = {
                id: "user-1",
                email: userEditDto.email,
                nickname: userEditDto.nickname,
                createdAt: foundUser.createdAt,
                updatedAt: foundUser.updatedAt,
            };

            mockUserRepository.findById.mockResolvedValue(foundUser);
            mockAuth.createHashPassword.mockResolvedValue(hashedPassword);
            mockAuth.createToken.mockReturnValue(newRefreshToken);
            mockUserRepository.update.mockResolvedValue(updatedUser);
            mockAuth.filterSensitiveUserData.mockReturnValue(filteredUser);

            // When: 유저 정보 업데이트
            const result = await userService.updateUser(userEditDto);

            // Then: 유저 정보가 업데이트되고 민감정보가 필터링된다
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(mockAuth.createHashPassword).toHaveBeenCalledWith(userEditDto.password);
            expect(mockAuth.createToken).toHaveBeenCalledWith(
                { email: userEditDto.email },
                "refresh"
            );
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                foundUser,
                expect.objectContaining({
                    email: userEditDto.email,
                    nickname: userEditDto.nickname,
                    password: hashedPassword,
                    refreshToken: newRefreshToken,
                })
            );
            expect(mockAuth.filterSensitiveUserData).toHaveBeenCalledWith(updatedUser);
            expect(result).toEqual(filteredUser);
        });

        it("should throw error when user not found", async () => {
            // Given: 존재하지 않는 유저의 업데이트 요청
            const updateDto = {
                userId: "nonexistent-user",
                email: "updated@example.com",
                nickname: "updateduser",
                password: "newPassword123",
            };


            // When & Then: 데이터 없음 에러가 발생한다
            await expect(userService.updateUser(updateDto)).rejects.toEqual(
                BusinessException({
                    type: BusinessExceptionType.DATA_NOT_FOUND,
                })
            );
            expect(mockUserRepository.findById).toHaveBeenCalledWith(updateDto.userId);
            expect(mockAuth.createHashPassword).not.toHaveBeenCalled();
            expect(mockUserRepository.update).not.toHaveBeenCalled();
        });

        it("should hash new password during update", async () => {
            // Given: 새 비밀번호로 유저 업데이트
            const userEditDto: UserEditDto = {
                email: "test@example.com",
                nickname: "testuser",
                password: "newPlainTextPassword",
                userId: "user-1"
            };

            const foundUser: PersistedUserEntity = {
                id: "user-1",
                email: "test@example.com",
                nickname: "testuser",
                password: "old_hashed_password",
                refreshToken: "old_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newHashedPassword = "$2b$10$newHashedPasswordValue";
            mockUserRepository.findById.mockResolvedValue(foundUser);
            mockAuth.createHashPassword.mockResolvedValue(newHashedPassword);
            mockAuth.createToken.mockReturnValue("new_refresh_token");
            mockUserRepository.update.mockResolvedValue({
                ...foundUser,
                password: newHashedPassword,
            });
            mockAuth.filterSensitiveUserData.mockReturnValue({});

            // When: 유저 업데이트
            await userService.updateUser(userEditDto);

            // Then: 새 비밀번호가 해시된다
            expect(mockAuth.createHashPassword).toHaveBeenCalledWith("newPlainTextPassword");
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                foundUser,
                expect.objectContaining({
                    password: newHashedPassword,
                })
            );
        });

        it("should regenerate refresh token during update", async () => {
            // Given: 유저 업데이트 요청
            const userEditDto: UserEditDto = {
                email: "newemail@example.com",
                nickname: "newNickname",
                password: "newPassword",
                userId: "user-1"
            };

            const foundUser: PersistedUserEntity = {
                id: "user-1",
                email: "old@example.com",
                nickname: "oldNickname",
                password: "old_hash",
                refreshToken: "old_refresh_token",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newRefreshToken = "regenerated_refresh_token_xyz";
            mockUserRepository.findById.mockResolvedValue(foundUser);
            mockAuth.createHashPassword.mockResolvedValue("new_hash");
            mockAuth.createToken.mockReturnValue(newRefreshToken);
            mockUserRepository.update.mockResolvedValue({
                ...foundUser,
                refreshToken: newRefreshToken,
            });
            mockAuth.filterSensitiveUserData.mockReturnValue({});

            // When: 유저 업데이트
            await userService.updateUser(userEditDto);

            // Then: 리프레시 토큰이 재생성된다
            expect(mockAuth.createToken).toHaveBeenCalledWith(
                { email: userEditDto.email },
                "refresh"
            );
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                foundUser,
                expect.objectContaining({
                    refreshToken: newRefreshToken,
                })
            );
        });
    });

    describe("getUserProducts", () => {
        it("should return all products for a user", async () => {
            // Given: 유저가 등록한 상품들
            const userId = "user-1";
            const userProducts: PersistedProduct[] = [
                {
                    id: "product-1",
                    name: "Product 1",
                    description: "Description 1",
                    price: 10000,
                    tags: ["tag1"],
                    userId,
                    likeCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: "product-2",
                    name: "Product 2",
                    description: "Description 2",
                    price: 20000,
                    tags: ["tag2"],
                    userId,
                    likeCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockProductRepository.findByUserId.mockResolvedValue(userProducts);

            // When: 유저의 상품 목록 조회
            const result = await userService.getUserProducts(userId);

            // Then: 상품 목록이 DTO로 변환되어 반환된다
            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: "product-1",
                name: "Product 1",
                price: 10000,
            });
            expect(result[1]).toMatchObject({
                id: "product-2",
                name: "Product 2",
                price: 20000,
            });
        });

        it("should return empty array when user has no products", async () => {
            // Given: 상품이 없는 유저
            const userId = "user-with-no-products";
            mockProductRepository.findByUserId.mockResolvedValue([]);

            // When: 유저의 상품 목록 조회
            const result = await userService.getUserProducts(userId);

            // Then: 빈 배열이 반환된다
            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual([]);
        });

        it("should call repository with correct user id", async () => {
            // Given: 특정 유저 ID
            const userId = "specific-user-456";
            mockProductRepository.findByUserId.mockResolvedValue([]);

            // When: 해당 유저의 상품 조회
            await userService.getUserProducts(userId);

            // Then: 올바른 ID로 repository가 호출된다
            expect(mockProductRepository.findByUserId).toHaveBeenCalledWith(userId);
        });
    });
});
