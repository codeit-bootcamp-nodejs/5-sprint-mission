export default class Article {
  #title;
  #content;
  #writer;
  #likeCount;
  #createdAt;

  constructor(title, content, writer, likeCount = 0, createdAt = new Date()) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = likeCount;
    this.#createdAt = createdAt;
  }

  like() {
    this.#likeCount += 1;
    return this.#likeCount;
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