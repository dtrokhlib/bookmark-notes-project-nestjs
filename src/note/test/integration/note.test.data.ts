import { CreateNoteDto, UpdateNoteDto } from 'src/note/dto';

export const userDto = { email: 'test-int@test.com', hash: '123321' };
export const createNoteDto: CreateNoteDto = {
  title: 'My test note',
  description: 'My test note description',
  relatedDate: '2022-07-20T19:28:44+00:00',
};
export const updateNoteDto: UpdateNoteDto = {
  title: 'My test note 2',
  description: 'My test note description 2',
  relatedDate: '2022-08-20T19:28:44+00:00',
};

export const INVALID_ID: number = -1;
