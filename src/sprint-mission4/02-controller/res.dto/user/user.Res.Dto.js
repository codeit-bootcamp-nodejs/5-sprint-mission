export class UserResDto {
  id;
  email;
  image;
  nickname;
  password;

  constructor(user){
    this.id = user.id;
    this.email = user.email;
    this.image = user.image;
    this.nickname = user.nickname;
    this.acc
    this.refreshToken = user.refreshToken;
  }
}