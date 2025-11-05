import {
  Article,
  ArticleCreateData,
  ArticleListParams,
  ArticleListResponse,
} from "../types/models";
import { StringOrNumber } from "../types/common";

const BASE_URL = "https://panda-market-api-crud.vercel.app/articles";

// 게시글 목록 조회
export function getArticleList({
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent",
}: ArticleListParams = {}): Promise<ArticleListResponse> {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}&orderBy=${orderBy}`;
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  });
}

// 게시글 상세 조회
export function getArticle(articleId: StringOrNumber): Promise<Article> {
  return fetch(`${BASE_URL}/${articleId}`).then((res) => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  });
}

// 게시글 생성
export function createArticle(data: ArticleCreateData): Promise<Article> {
  return fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  });
}

// 게시글 수정
export function patchArticle(
  articleId: StringOrNumber,
  data: ArticleCreateData
): Promise<Article> {
  return fetch(`${BASE_URL}/${articleId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  });
}

// 게시글 삭제
export function deleteArticle(
  articleId: StringOrNumber
): Promise<{ message: string }> {
  return fetch(`${BASE_URL}/${articleId}`, { method: "DELETE" }).then((res) => {
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  });
}
