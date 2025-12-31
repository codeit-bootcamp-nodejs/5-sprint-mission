import { prismaClient } from "../../common/lib/prisma.client";
import bcrypt from "bcrypt";

export async function createTestUser(
  overrides: Partial<{
    email: string;
    password: string;
    nickname: string;
  }> = {},
) {
  const defaults = {
    email: "test@example.com",
    password: "test_password_123",
    nickname: "testuser",
  };

  const userData = { ...defaults, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return prismaClient.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      nickname: userData.nickname,
    },
  });
}

export async function createTestArticle(
  userId: number,
  overrides: Partial<{
    title: string;
    content: string;
    image: string;
  }> = {},
) {
  const defaults = {
    title: "테스트 게시글",
    content: "테스트 게시글 내용",
    image: null,
  };

  const articleData = { ...defaults, ...overrides };

  return prismaClient.article.create({
    data: {
      title: articleData.title,
      content: articleData.content,
      image: articleData.image,
      userId,
    },
  });
}

export async function createTestComment(
  articleId: number,
  userId: number,
  overrides: Partial<{
    content: string;
  }> = {},
) {
  const defaults = {
    content: "테스트 댓글 내용",
  };

  const commentData = { ...defaults, ...overrides };

  return prismaClient.comment.create({
    data: {
      content: commentData.content,
      articleId,
      userId,
    },
  });
}

export async function createTestArticles(
  userId: number,
  count: number,
  overridesFn?: (index: number) => Partial<{
    title: string;
    content: string;
    image: string;
  }>,
) {
  const articles = [];

  for (let i = 0; i < count; i++) {
    const overrides = overridesFn ? overridesFn(i) : {};
    const article = await createTestArticle(userId, overrides);
    articles.push(article);
  }

  return articles;
}

export async function cleanupTestData() {
  await prismaClient.comment.deleteMany({});
  await prismaClient.like.deleteMany({});
  await prismaClient.article.deleteMany({});
  await prismaClient.user.deleteMany({});
}
