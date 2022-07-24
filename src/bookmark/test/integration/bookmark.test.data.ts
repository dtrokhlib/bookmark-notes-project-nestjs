import { CreateBookmarkDto, UpdateBookmarkDto } from 'src/bookmark/dto';

export const userDto = { email: 'test-int-bookmark@test.com', hash: '123321' };
export const createBookmarkDto: CreateBookmarkDto = {
  title: 'My test bookmark',
  description: 'My test bookmark description',
  link: 'https://google.com',
};
export const updateBookmarkDto: UpdateBookmarkDto = {
  title: 'My test bookmark 2',
  description: 'My test bookmark description 2',
  link: 'https://www.youtube.com/',
};
export const INVALID_ID: number = -1;
