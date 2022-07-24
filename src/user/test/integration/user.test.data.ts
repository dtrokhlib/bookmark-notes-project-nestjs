import { EditUserDto } from 'src/user/dto';

export const userDto = { email: 'test-int-user@test.com', hash: '123321' };
export const updateUserDto: EditUserDto = {
  email: 'test-int-user2@test.com',
  firstName: 'test 1',
  lastName: 'test 2',
};
export const INVALID_ID: number = -1;
