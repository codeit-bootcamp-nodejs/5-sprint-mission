import ArticleId from "../entity/article-id.js";
import Article from "../entity/article.js";
import BaseRepository from "./base-repository.js";

export default class ArticleRepository extends BaseRepository {
  constructor() {
    super("articles");
  }

  getArticleList(params) {
    return this.instance
      .get("", {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          orderBy: params.orderBy,
        },
      })
      .then((res) => {
        const { list } = res.data;
        return list.map(
          (item) =>
            new Article(item.id, item.title, item.content, item.createdAt),
        );
      })
      .catch((e) => {
        if (e.response) {
          console.error("Status:", e.response.status);
          console.error("Data:", e.response.data);
        } else {
          console.error("Message:", e.message);
        }
      });
  }

  getArticle(id) {
    return this.instance
      .get(`/${id}`)
      .then((res) => {
        const item = res.data;
        return new Article(item.id, item.title, item.content, item.createdAt);
      })
      .catch((e) => {
        if (e.response) {
          console.error("Status:", e.response.status);
          console.error("Data:", e.response.data);
        } else {
          console.error("Message:", e.message);
        }
      });
  }

  createArticle(surveyData, newWriter) {
    return this.instance
      .post("/", surveyData)
      .then((res) => {
        const item = res.data;
        return new Article(
          item.id,
          item.title,
          item.content,
          item.createdAt,
          newWriter,
        );
      })
      .catch((e) => {
        if (e.response) {
          console.error("API 요청 실패 - Status:", e.response.status);
          console.error("Data:", e.response.data);
        } else if (e.request) {
          console.error("API 요청 실패 - Request:", e.request);
        } else {
          console.error("API 요청 실패 - Message:", e.message);
        }
        throw e;
      });
  }

  patchArticle(id, surveyData) {
    return this.instance
      .patch(`/${id}`, surveyData)
      .then((res) => {
        const item = res.data;
        return new Article(item.id, item.title, item.content, item.createdAt);
      })
      .catch((e) => {
        if (e.response) {
          console.error("Status:", e.response.status);
          console.error("Data:", e.response.data);
        } else {
          console.error("Message:", e.message);
        }
      });
  }

  deleteArticle(id) {
    return this.instance
      .delete(`/${id}`, { data: { id: id } })
      .then((res) => {
        const item = res.data;
        return new ArticleId(item.id);
      })
      .catch((e) => {
        if (e.response) {
          console.error("Status:", e.response.status);
          console.error("Data:", e.response.data);
        } else {
          console.error("Message:", e.message);
        }
      });
  }
}
