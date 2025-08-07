export interface SignInOrRegisterRequestDto {
  email: string;
  password: string;
}

export interface SignInOrRegisterResponseDto {
  status: number;
  type: 'Bearer';
  token: string;
  expiresIn: string;
}
