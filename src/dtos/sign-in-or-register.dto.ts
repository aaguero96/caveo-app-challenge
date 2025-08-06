export interface SignInOrRegisterRequestDto {
  email: string;
  password: string;
}

export interface SignInOrRegisterResponseDto {
  type: 'Bearer';
  token: string;
  expiresIn: string;
}
