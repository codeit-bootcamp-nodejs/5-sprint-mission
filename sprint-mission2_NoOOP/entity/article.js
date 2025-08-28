export default class Article {
  #title;
  #content;
  #writer;
  #likeCount;
  #createdAt;

  constructor(title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#createdAt = new Date(); // 현재 시간으로 설정
    this.#likeCount = 0;
  }

  like() {
    this.#likeCount += 1;
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

  showInfo() {
    console.log(
      `[작성한 시간]: ${this.#createdAt}\t[글 ID]: ${this.#writer}\t [제목]: ${this.title}\t [내용]: ${this.content}`,
    );
  }
}
