interface IUploadArticleDto {
  title: string;
  content: string;
  images?: string[];
}

export class UploadArticleDto {
  title: string;
  content: string;
  images?: string[];

  constructor({ title, content, images }: IUploadArticleDto) {
    this.title = title;
    this.content = content;
    this.images = images;
  }
}