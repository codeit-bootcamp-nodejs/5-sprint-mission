interface ILoginDto {
  email: string;
  password: string;
}

export class LoginDto {
  email;
  password;

  constructor({ email, password }: ILoginDto) {
    this.email = email;
    this.password = password;
  }
}
