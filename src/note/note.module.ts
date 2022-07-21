import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';

@Module({
  providers: [NoteService],
  controllers: [NoteController]
})
export class NoteModule {}
