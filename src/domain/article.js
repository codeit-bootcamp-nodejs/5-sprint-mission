export class Article {
  _title;
  _content;
  _writer;
  _likeCount;
  _createdAt;

  constructor({ title, content, writer, likeCount = 0 }) {
    this._title = title;
    this._content = content;
    this._writer = writer;
    this._likeCount = likeCount;
    this._createdAt = new Date();
  }

  getTitle() {
    return this._title;
  }

  getContent() {
    return this._content;
  }

  getLikeCount() {
    return this._likeCount;
  }

  getCreatedAt() {
    return this._createdAt;
  }

  like() {
    this._likeCount++;
  }
}
