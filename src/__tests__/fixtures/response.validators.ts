export function expectArticleListResponse(body: any) {
  expect(body).toHaveProperty("list");
  expect(body).toHaveProperty("totalCount");
  expect(Array.isArray(body.list)).toBe(true);
  expect(typeof body.totalCount).toBe("number");
}

export function expectArticleResponse(body: any) {
  expect(body).toHaveProperty("id");
  expect(body).toHaveProperty("title");
  expect(body).toHaveProperty("content");
  expect(body).toHaveProperty("userId");
  expect(body).toHaveProperty("createdAt");
  expect(body).toHaveProperty("updatedAt");

  expect(typeof body.id).toBe("number");
  expect(typeof body.title).toBe("string");
  expect(typeof body.content).toBe("string");
  expect(typeof body.userId).toBe("number");
}
export function expectArticleData(
  actual: any,
  expected: Partial<{
    id: number;
    title: string;
    content: string;
    userId: number;
    image: string | null;
  }>,
) {
  if (expected.id !== undefined) {
    expect(actual.id).toBe(expected.id);
  }
  if (expected.title !== undefined) {
    expect(actual.title).toBe(expected.title);
  }
  if (expected.content !== undefined) {
    expect(actual.content).toBe(expected.content);
  }
  if (expected.userId !== undefined) {
    expect(actual.userId).toBe(expected.userId);
  }
  if (expected.image !== undefined) {
    expect(actual.image).toBe(expected.image);
  }
}

export function expectErrorResponse(
  body: any,
  expectedStatus: number,
  expectedMessage?: string,
) {
  expect(body).toHaveProperty("message");
  expect(typeof body.message).toBe("string");

  if (expectedMessage) {
    expect(body.message).toContain(expectedMessage);
  }
}

export function expectCreatedArticleResponse(body: any) {
  expectArticleResponse(body);

  expect(body.id).toBeGreaterThan(0);
  expect(new Date(body.createdAt)).toBeInstanceOf(Date);
  expect(new Date(body.updatedAt)).toBeInstanceOf(Date);
}

export function expectPaginationResponse(
  body: any,
  expectedPage: number,
  expectedPageSize: number,
  expectedTotal: number,
) {
  expectArticleListResponse(body);

  expect(body.totalCount).toBe(expectedTotal);
  expect(body.list.length).toBeLessThanOrEqual(expectedPageSize);
}

export function expectArticleListOrder(
  body: any,
  field: string,
  order: "asc" | "desc",
) {
  expectArticleListResponse(body);

  const list = body.list;
  if (list.length < 2) return;

  for (let i = 1; i < list.length; i++) {
    const prev = new Date(list[i - 1][field]).getTime();
    const curr = new Date(list[i][field]).getTime();

    if (order === "desc") {
      expect(prev).toBeGreaterThanOrEqual(curr);
    } else {
      expect(prev).toBeLessThanOrEqual(curr);
    }
  }
}

export function expectUnauthorizedResponse(body: any) {
  expectErrorResponse(body, 401);
  expect(body.message).toContain("인증");
}

export function expectForbiddenResponse(body: any) {
  expectErrorResponse(body, 403);
  const message = body.message;
  const isForbiddenMessage =
    message.includes("권한") ||
    message.includes("소유자") ||
    message.includes("작성자");
  expect(isForbiddenMessage).toBe(true);
}

export function expectNotFoundResponse(body: any) {
  expectErrorResponse(body, 404);
  expect(body.message).toContain("존재하지");
}

export function expectBadRequestResponse(body: any) {
  expectErrorResponse(body, 400);
}
