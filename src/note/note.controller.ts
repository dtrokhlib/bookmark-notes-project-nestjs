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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { NoteService } from './note.service';

@ApiTags('Notes')
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get(':id')
  getNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
  ) {
    return this.noteService.getNotesById(userId, noteId);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Invalid user id' })
  @ApiBody({ type: [CreateNoteDto] })
  @Post()
  createNote(@GetUser('id') userId: number, @Body() dto: CreateNoteDto) {
    return this.noteService.createNote(userId, dto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({ type: [UpdateNoteDto] })
  @Patch(':id')
  updateNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.noteService.updateNoteById(userId, noteId, dto);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Access denied' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteNoteById(
    @Param('id', ParseIntPipe) noteId: number,
    @GetUser('id') userId: number,
  ) {
    return this.noteService.deleteNoteById(userId, noteId);
  }
}
