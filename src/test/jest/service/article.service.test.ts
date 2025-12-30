import { INotificationEventBus } from "../../../shared/eventbus/ports/I.notification.eventbus";
import { BusinessExceptionType } from "../../../shared/exception/exception";
import { IArticleCommandRepository } from "../../../02-application/port/repositories/command/I.article.repository";
import { PersistedArticle } from "../../../02-application/command/entity/article";
import {
  ArticleCommandServiceType,
  createArticleCommandService,
} from "../../../02-application/command/service/article.command.service";
import {
  ArticleQueryServiceType,
  createArticleQueryService,
} from "../../../02-application/query/service/article.query.service";
import { IArticleQueryRepository } from "../../../02-application/port/repositories/query/I.article.query.repository";
import { IRedisExternal } from "../../../02-application/port/externals/I.redis.external";

describe("Article Service 단위 테스트", () => {
  let mockArticleRepo: IArticleCommandRepository;
  let mockRedisExternal: IRedisExternal;
  let mockArticleQueryRepo: IArticleQueryRepository;
  let mockNotificationEventBus: INotificationEventBus;
  let articleCommandService: ArticleCommandServiceType;
  let articleQueryService: ArticleQueryServiceType;

  beforeEach(() => {
    mockRedisExternal = {
      set: jest.fn(),
      setIfNotExist: jest.fn(),
      get: jest.fn(),
      remove: jest.fn(),
    };

    // Mock Repository
    mockArticleRepo = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };


    mockArticleQueryRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };

    // Mock EventBus
    mockNotificationEventBus = {
      subscribe: jest.fn(),
      publish: jest.fn(),
      subscribeAll: jest.fn(),
      publishAll: jest.fn(),
    };

    // Create Service
    articleCommandService = createArticleCommandService(
      mockArticleRepo,
      mockNotificationEventBus,
    );

    articleQueryService = createArticleQueryService(
      mockRedisExternal,
      mockArticleQueryRepo,
      mockNotificationEventBus,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("게시글 생성 (createArticle)", () => {
    const createDto = {
      title: "테스트 제목",
      content: "테스트 내용",
      userId: "user-123",
    };

    test("새 게시글을 성공적으로 생성해야 합니다", async () => {
      // Given
      const mockSavedArticle: PersistedArticle = {
        id: "article-123",
        title: createDto.title,
        content: createDto.content,
        userId: createDto.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockArticleRepo.save as jest.Mock).mockResolvedValue(mockSavedArticle);

      // Spy on save
      const spySave = jest.spyOn(mockArticleRepo, "save");

      // When
      const result = await articleCommandService.createArticle(createDto);

      // Then
      expect(spySave).toHaveBeenCalledWith({
        title: createDto.title,
        content: createDto.content,
        userId: createDto.userId,
      });
      expect(spySave).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: mockSavedArticle.id,
        title: mockSavedArticle.title,
        content: mockSavedArticle.content,
        userId: mockSavedArticle.userId,
        createdAt: mockSavedArticle.createdAt,
        updatedAt: mockSavedArticle.updatedAt,
      });
    });

    test("저장소에서 에러 발생 시 예외를 전파해야 합니다", async () => {
      // Given
      const error = new Error("Database error");
      (mockArticleRepo.save as jest.Mock).mockRejectedValue(error);

      // Spy on save
      const spySave = jest.spyOn(mockArticleRepo, "save");

      // When & Then
      await expect(
        articleCommandService.createArticle(createDto),
      ).rejects.toThrow(error);
      expect(spySave).toHaveBeenCalledTimes(1);
    });
  });

  describe("게시글 목록 조회 (getAllArticles)", () => {
    test("쿼리 조건에 맞는 게시글 목록을 반환해야 합니다", async () => {
      // Given
      const query = { offset: 0, limit: 10, search: "", sort: "desc" as const };
      const mockArticles: PersistedArticle[] = [
        {
          id: "article-1",
          title: "제목 1",
          content: "내용 1",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "article-2",
          title: "제목 2",
          content: "내용 2",
          userId: "user-2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (mockArticleQueryRepo.findAll as jest.Mock).mockResolvedValue(
        mockArticles,
      );

      // Spy on findAll
      const spyFindAll = jest.spyOn(mockArticleQueryRepo, "findAll");

      // When
      const result = await articleQueryService.getAllArticles(query);

      // Then
      expect(spyFindAll).toHaveBeenCalledWith(query);
      expect(spyFindAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("article-1");
      expect(result[1].id).toBe("article-2");
    });

    test("빈 배열을 반환할 수 있어야 합니다", async () => {
      // Given
      const query = { offset: 0, limit: 10, search: "", sort: "desc" as const };
      (mockArticleQueryRepo.findAll as jest.Mock).mockResolvedValue([]);

      // Spy on findAll
      const spyFindAll = jest.spyOn(mockArticleQueryRepo, "findAll");

      // When
      const result = await articleQueryService.getAllArticles(query);

      // Then
      expect(spyFindAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(0);
    });
  });

  describe("게시글 단건 조회 (getArticle)", () => {
    test("ID로 게시글을 성공적으로 조회해야 합니다", async () => {
      // Given
      const articleId = "article-123";
      const mockArticle: PersistedArticle = {
        id: articleId,
        title: "테스트 제목",
        content: "테스트 내용",
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockArticleQueryRepo.findById as jest.Mock).mockResolvedValue(
        mockArticle,
      );

      // Spy on findById
      const spyFindById = jest.spyOn(mockArticleQueryRepo, "findById");

      // When
      const result = await articleQueryService.getArticle(articleId);

      // Then
      expect(spyFindById).toHaveBeenCalledWith(articleId);
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: mockArticle.id,
        title: mockArticle.title,
        content: mockArticle.content,
        userId: mockArticle.userId,
        createdAt: mockArticle.createdAt,
        updatedAt: mockArticle.updatedAt,
      });
    });

    test("존재하지 않는 게시글 조회 시 저장소 에러를 전파해야 합니다", async () => {
      // Given
      const articleId = "non-existent";
      const error = new Error("Article not found");
      (mockArticleQueryRepo.findById as jest.Mock).mockRejectedValue(error);

      // Spy on findById
      const spyFindById = jest.spyOn(mockArticleQueryRepo, "findById");

      // When & Then
      await expect(articleQueryService.getArticle(articleId)).rejects.toThrow(
        error,
      );
      expect(spyFindById).toHaveBeenCalledWith(articleId);
    });
  });

  describe("게시글 수정 (updateArticle)", () => {
    const updateDto = {
      id: "article-123",
      title: "수정된 제목",
      content: "수정된 내용",
      userId: "user-123",
    };

    test("작성자 본인이면 게시글을 성공적으로 수정해야 합니다", async () => {
      // Given
      const existingArticle: PersistedArticle = {
        id: updateDto.id,
        title: "원본 제목",
        content: "원본 내용",
        userId: updateDto.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedArticle: PersistedArticle = {
        ...existingArticle,
        title: updateDto.title,
        content: updateDto.content,
        updatedAt: new Date(),
      };

      (mockArticleRepo.findById as jest.Mock).mockResolvedValue(
        existingArticle,
      );
      (mockArticleRepo.update as jest.Mock).mockResolvedValue(updatedArticle);

      // Spy on findById and update
      const spyFindById = jest.spyOn(mockArticleRepo, "findById");
      const spyUpdate = jest.spyOn(mockArticleRepo, "update");

      // When
      const result = await articleCommandService.updateArticle(updateDto);

      // Then
      expect(spyFindById).toHaveBeenCalledWith(updateDto.id);
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyUpdate).toHaveBeenCalledWith(existingArticle, {
        title: updateDto.title,
        content: updateDto.content,
        userId: updateDto.userId,
      });
      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(result.title).toBe(updateDto.title);
      expect(result.content).toBe(updateDto.content);
    });

    test("ID가 없으면 WRONG_URL 예외를 던져야 합니다", async () => {
      // Given
      const invalidDto = {
        title: "제목",
        content: "내용",
        userId: "user-123",
      };

      // When & Then
      await expect(
        articleCommandService.updateArticle(invalidDto as any),
      ).rejects.toMatchObject({
        type: BusinessExceptionType.WRONG_URL,
      });
    });

    test("작성자가 아니면 UNAUTORIZED_REQUEST 예외를 던져야 합니다", async () => {
      // Given
      const existingArticle: PersistedArticle = {
        id: updateDto.id,
        title: "원본 제목",
        content: "원본 내용",
        userId: "different-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockArticleRepo.findById as jest.Mock).mockResolvedValue(
        existingArticle,
      );

      // Spy on findById and update
      const spyFindById = jest.spyOn(mockArticleRepo, "findById");
      const spyUpdate = jest.spyOn(mockArticleRepo, "update");

      // When & Then
      await expect(
        articleCommandService.updateArticle(updateDto),
      ).rejects.toMatchObject({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
      expect(spyFindById).toHaveBeenCalledWith(updateDto.id);
      expect(spyUpdate).not.toHaveBeenCalled();
    });
  });

  describe("게시글 삭제 (deleteArticle)", () => {
    const articleId = "article-123";
    const userId = "user-123";

    test("작성자 본인이면 게시글을 성공적으로 삭제해야 합니다", async () => {
      // Given
      const existingArticle: PersistedArticle = {
        id: articleId,
        title: "테스트 제목",
        content: "테스트 내용",
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockArticleRepo.findById as jest.Mock).mockResolvedValue(
        existingArticle,
      );
      (mockArticleRepo.remove as jest.Mock).mockResolvedValue(undefined);

      // Spy on findById and remove
      const spyFindById = jest.spyOn(mockArticleRepo, "findById");
      const spyRemove = jest.spyOn(mockArticleRepo, "remove");

      // When
      await articleCommandService.deleteArticle(articleId, userId);

      // Then
      expect(spyFindById).toHaveBeenCalledWith(articleId);  
      expect(spyFindById).toHaveBeenCalledTimes(1);
      expect(spyRemove).toHaveBeenCalledWith(articleId);
      expect(spyRemove).toHaveBeenCalledTimes(1);
    });

    test("게시글이 존재하지 않으면 DATA_NOT_FOUND 예외를 던져야 합니다", async () => {
      // Given
      (mockArticleRepo.findById as jest.Mock).mockResolvedValue(null);

      // Spy on findById and remove
      const spyFindById = jest.spyOn(mockArticleRepo, "findById");
      const spyRemove = jest.spyOn(mockArticleRepo, "remove");

      // When & Then
      await expect(
        articleCommandService.deleteArticle(articleId, userId),
      ).rejects.toMatchObject({
        type: BusinessExceptionType.DATA_NOT_FOUND,
      });
      expect(spyFindById).toHaveBeenCalledWith(articleId);
      expect(spyRemove).not.toHaveBeenCalled();
    });

    test("작성자가 아니면 UNAUTORIZED_REQUEST 예외를 던져야 합니다", async () => {
      // Given
      const existingArticle: PersistedArticle = {
        id: articleId,
        title: "테스트 제목",
        content: "테스트 내용",
        userId: "different-user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (mockArticleRepo.findById as jest.Mock).mockResolvedValue(
        existingArticle,
      );

      // Spy on findById and remove
      const spyFindById = jest.spyOn(mockArticleRepo, "findById");
      const spyRemove = jest.spyOn(mockArticleRepo, "remove");

      // When & Then
      await expect(
        articleCommandService.deleteArticle(articleId, userId),
      ).rejects.toMatchObject({
        type: BusinessExceptionType.UNAUTORIZED_REQUEST,
      });
      expect(spyFindById).toHaveBeenCalledWith(articleId);
      expect(spyRemove).not.toHaveBeenCalled();
    });
  });
});
