import { BaseEntity } from "./baseEntity.js";

export class Comment extends BaseEntity{
  #targetType;
  #targetId;
  #content;

  constructor({id, targetType, targetId, content, createdAt, updatedAt}){
    super({id, createdAt, updatedAt});
    this.#content = content;
    this.#targetType = targetType;
    this.#targetId = targetId;
  }

  
  static factory = ({targetType, targetId, id, content}) => {
    if(content !== undefined){
      this.validateContentRule(content);
    }
    return new Comment({targetType, targetId, id, content});
  }
  
  static validateContentRule = (content) => {
    if (content.length < 5) {
      throw new Exception("CONTENT_TOO_SHORT");
    }
  }

  get content() {
    return this.#content;
  }
  get targetType(){
    return this.#targetType;
  }
  get targetId() {
    return this.#targetId;
  }
}