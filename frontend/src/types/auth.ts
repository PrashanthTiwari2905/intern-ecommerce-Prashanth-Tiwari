export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
}