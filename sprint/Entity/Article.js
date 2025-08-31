export default class Article {
  #title
  #content
  #writer
  #likeCount
  #createdAt

  constructor (title, content, writer) {
    this.#title = title;
    this.#content = content;
    this.#writer = writer;
    this.#likeCount = 0;
    this.#createdAt = new Date();
  }

  
  like() {
    return this.#likeCount += 1
  } 
  
  get title(){
    return this.#title;
  }
 
  get content(){
    return this.#content;
  }
 
  get writer(){
    return this.#writer
  }
 
  get createdAt() {
    return this.#createdAt
  }
  
}