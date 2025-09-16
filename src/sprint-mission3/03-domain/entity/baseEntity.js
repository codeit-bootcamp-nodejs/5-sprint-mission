export class BaseEntity {
  #id;
  #createdAt;
  #updatedAt;
  
  constructor({id = undefined, createdAt = undefined, updatedAt = undefined}){
    this.#id = id;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id() {
    return this.#id;
  }
  get createdAt() {
    return this.#createdAt;
  }
  get updatedAt() {
    return this.#updatedAt;
  }
}