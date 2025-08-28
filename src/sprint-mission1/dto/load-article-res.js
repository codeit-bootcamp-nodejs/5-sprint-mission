export default class LoadArticleRes {
  #id;
  #title; // 글 제목
  #content; // 글 내용
  #writer; // 작성자
  #likeCount; // 좋아요 수
  #createdAt; // 생성 일자

  constructor(
    id,
    title,
    content,
    createdAt,
    writer = "알수없음",
    likeCount = 0,
  ) {
    this.#id = id;
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#createdAt = createdAt;
    this.#likeCount = likeCount;
  }

  get id() {
    return this.#id;
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

  get createdAt() {
    return this.#createdAt;
  }

  get likeCount() {
    return this.#likeCount;
  }

  set likeCount(count) {
    this.#likeCount = count;
  }
}
