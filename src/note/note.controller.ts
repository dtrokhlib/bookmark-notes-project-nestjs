import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from '../common/decorators';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
  ) {
    return this.noteService.getNotesById(userId, noteId);
  }

  @Post()
  createNote(@GetUser('id') userId: number, @Body() dto: CreateNoteDto) {
    return this.noteService.createNote(userId, dto);
  }

  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.noteService.updateNoteById(userId, noteId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
  ) {
    return this.noteService.deleteNoteById(userId, noteId);
  }
}
