interface IEditArticleDto {
  title?: string;
  content?: string;
  images?: string[];
}

export class EditArticleDto {
  title?: string;
  content?: string;
  images?: string[];

  constructor({ title, content, images }: IEditArticleDto) {
    this.title = title;
    this.content = content;
    this.images = images;
  }
}