export interface SignupDto {
  email: string;
  nickname: string;
  password: string;
}

export interface SigninDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  createdAt: Date;
  image?: string | null;
}
