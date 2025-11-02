export interface UserPayload {
  id: number;
  email?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}
