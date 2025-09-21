export default class Article {
  constructor(title, content, writer, likeCount = 0, createdAt = new Date()) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.createdAt = new Date(createdAt); // 현재 시간 저장
  }

  like() {
    this.likeCount++;
  }
}
