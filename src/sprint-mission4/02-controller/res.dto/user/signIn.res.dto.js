export class SignInResDto{
  id;
  email;
  image;
  nickname;

  constructor(accessToken, user){
    this.id = user.id;
    this.email = user.email;
    this.image = user.image;
    this.nickname = user.nickname;
    this.accessToken = accessToken;
    this.refreshToken = user.refreshToken;
  }
}