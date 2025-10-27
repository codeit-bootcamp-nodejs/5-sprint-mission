import { BASE_URL } from "../lib/constants.js";

class HttpService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async handleRequest(requestFn, operation, resourceName) {
    try {
      const response = await requestFn();
      if (!response.ok) {
        throw new Error(`Failed to ${operation} ${resourceName}`);
      }
      return response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async get(url, params = {}) {
    const urlWithParams = new URL(url, this.baseUrl);
    Object.keys(params).forEach((key) =>
      urlWithParams.searchParams.append(key, params[key])
    );

    return fetch(urlWithParams.toString());
  }

  async post(url, data) {
    return fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async patch(url, data) {
    return fetch(`${this.baseUrl}${url}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async delete(url) {
    return fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
    });
  }
}

class ArticleService extends HttpService {
  constructor() {
    super(BASE_URL);
    this.resourceName = "articles";
  }

  async getList({ page, pageSize, keyword }) {
    return this.handleRequest(
      () =>
        this.get(
          `/${this.resourceName}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
        ),
      "fetch",
      this.resourceName
    );
  }

  async getById(id) {
    return this.handleRequest(
      () => this.get(`/${this.resourceName}/${id}`),
      "fetch",
      this.resourceName
    );
  }

  async create({ title, content, image }) {
    return this.handleRequest(
      () => this.post(`/${this.resourceName}`, { title, content, image }),
      "create",
      this.resourceName
    );
  }

  async update(id, data) {
    return this.handleRequest(
      () => this.patch(`/${this.resourceName}/${id}`, data),
      "update",
      this.resourceName
    );
  }

  async remove(id) {
    return this.handleRequest(
      () => this.delete(`/${this.resourceName}/${id}`),
      "delete",
      this.resourceName
    );
  }
}

// 기존 함수형 인터페이스 유지
const articleService = new ArticleService();

export function getArticleList(params) {
  return articleService.getList(params);
}

export async function getArticle(articleId) {
  return articleService.getById(articleId);
}

export async function createArticle(data) {
  return articleService.create(data);
}

export async function patchArticle(articleId, data) {
  return articleService.update(articleId, data);
}

export async function deleteArticle(articleId) {
  return articleService.remove(articleId);
}
