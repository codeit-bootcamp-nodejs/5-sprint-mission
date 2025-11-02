interface IUpdateUserDto {
  email?: string;
  password?: string;
  nickname?: string;
  image?: string;
}

export class updateUserDto {
  email;
  password;
  nickname;
  image;

  constructor({ email, password, nickname, image }: IUpdateUserDto) {
    this.email = email;
    this.password = password;
    this.image = image;
    this.nickname = nickname;
  }
}
