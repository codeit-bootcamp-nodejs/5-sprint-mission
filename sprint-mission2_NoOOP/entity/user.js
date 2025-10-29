export default class User {
  #email;
  #password;
  #nickname;

  constructor(email, password, nickname) {
    this.#email = email;
    this.#password = password;
    this.#nickname = nickname;
  }

  get email() {
    return this.#email;
  }

  get password() {
    return this.#password;
  }

  get nickname() {
    return this.#nickname;
  }
}
