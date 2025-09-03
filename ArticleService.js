import axios from "axios";

export class Article {
  #title;
  #content;
  #writer;
  #likeCount;
  #createdAt;

  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = 0;
    this.#createdAt = new Date();
  }

  like() {
    this.#likeCount++;
    console.log(
      `'${this.title}' 게시글의 좋아요 수가 1 증가하여 ${this.likeCount}가 되었습니다.`,
    );
  }
  get title() {
    return this.#title;
  }
  get content() {
    return this.#content;
  }
  get writer() {
    return this.#writer;
  }
  get likeCount() {
    return this.#likeCount;
  }
  get createdAt() {
    return this.#createdAt;
  }
}

const instance = axios.create({
  baseURL: `https://panda-market-api-crud.vercel.app`,
});

export function getArticleList(params = {}) {
  const res = instance.get(`/articles`, { params });

  return res
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log("데이터를 불러오는데 실패했습니다."));
}

export function getArticle(id) {
  const res = instance.get(`/articles/${id}`);
  return res
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log("id를 잘못입력하였습니다."));
}

export function createArticle(bodyData) {
  const res = instance.post(`/articles`, bodyData);
  return res
    .then((response) => response.data)
    .catch((error) => console.log(error.data));
}

export function patchArticle(id, bodyData) {
  const res = instance.patch(`/articles/${id}`, bodyData);
  return res
    .then((response) => response.data)
    .catch((error) => console.log(error.data));
}

export function deleteArticle(id) {
  const res = instance.delete(`/articles/${id}`);
  return res
    .then((response) => response.data)
    .catch((error) => console.log(error.data));
}
