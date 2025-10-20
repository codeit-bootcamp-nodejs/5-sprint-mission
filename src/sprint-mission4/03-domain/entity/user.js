export class User {
  #email;
  #nickname;
  #image;
  #password;
  
  constructor({
    id,
    email,
    nickname,
    image = undefined,
    password,
    createdAt = undefined,
    updatedAt = undefined,
  }) {
    super({id, createdAt, updatedAt});
    this.#email = email;
    this.#nickname = nickname;
    this.#image = image;
    this.#password = password;
  }

  get email() {
    return this.#email;
  }
  get nickname() {
    return this.#nickname;
  }
  get image() {
    return this.#image;
  }
  get password() {
    return this.#password;
  }
}