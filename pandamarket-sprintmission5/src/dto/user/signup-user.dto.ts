interface ISignUpDto {
  email: string;
  password: string;
  nickname: string;
}

export class SignUpDto {
  email;
  password;
  nickname;

  constructor({ email, password, nickname }: ISignUpDto) {
    this.email = email;
    this.password = password;
    this.nickname = nickname;
  }
}
