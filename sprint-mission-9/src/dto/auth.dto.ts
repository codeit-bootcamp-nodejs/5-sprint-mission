export interface SignUpDto {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenDto {
  refreshToken: string;
}
