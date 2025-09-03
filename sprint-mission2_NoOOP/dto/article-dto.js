export default class ArticleDTO {
  image;
  content;
  title;

  constructor(image, content, title) {
    this.image = image;
    this.content = content;
    this.title = title;
  }
}
