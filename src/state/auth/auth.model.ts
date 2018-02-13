export interface Credentials {
  username: string;
  password: string;
}

export interface Tokens {
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
}

export interface AccessTokenPayload {
  iat: number;
  exp: number;
  jti: string;
  data: Identity;
}

export interface Identity {
  userId: string;
}
