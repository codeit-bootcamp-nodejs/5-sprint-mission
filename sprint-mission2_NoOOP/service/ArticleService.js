import axios from "axios";

export default class ArticleService {
  #baseURL;

  constructor() {
    this.#baseURL = new URL(
      "https://panda-market-api-crud.vercel.app/articles",
    ); // <== [중복됨] BaseURL 클래스를 만들어서 상속 받을 생각이었으나 과제 범위를 벗어날 것 같아서 멈췄습니다.
  }

  async getArticleList(page, pageSize, keyword = "") {
    try {
      const response = await axios.get(
        `${this.#baseURL}?page=${page}&pageSize=${pageSize}&orderBy=recent&keyword=${keyword}`,
      );
      return response.data.list;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return [];
    }
  }

  async getArticle(articleId) {
    try {
      const response = await axios.get(`${this.#baseURL}/${articleId}`);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async createArticle(article) {
    try {
      const response = await axios.post(`${this.#baseURL}`, article);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async patchArticle(articleId, article) {
    try {
      const response = await axios.patch(
        `${this.#baseURL}/${articleId}`,
        article,
      );
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }

  async deleteArticle(articleId) {
    try {
      const response = await axios.delete(`${this.#baseURL}/${articleId}`);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.error(e.response);
      } else {
        console.error("리퀘스트에 실패했습니다.");
      }
      return null;
    }
  }
}
