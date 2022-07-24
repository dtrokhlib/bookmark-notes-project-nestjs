import { AuthDto } from 'src/auth/dto';

export const authDto: AuthDto = {
  email: 'test@test.com',
  password: '123321',
};

export const INVALID_EMAIL = 'invalid@test.com';
export const INVALID_PASSWORD = 'invalid_password';
export const INVALID_ID = -1;
