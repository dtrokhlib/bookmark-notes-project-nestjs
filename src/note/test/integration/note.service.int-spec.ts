import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CreateNoteDto, UpdateNoteDto } from 'src/note/dto';
import { NoteService } from 'src/note/note.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createNoteDto,
  INVALID_ID,
  updateNoteDto,
  userDto,
} from './note.test.data';

describe('NoteService Int', () => {
  let prismaService: PrismaService;
  let noteService: NoteService;

  let userId: number;
  let noteId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    noteService = moduleRef.get(NoteService);

    await prismaService.cleanDb();
  });

  afterAll(async () => {
    prismaService.onModuleDestroy();
  });

  describe('create note', () => {
    it('should create user', async () => {
      const user = await prismaService.user.create({
        data: userDto,
      });
      userId = user.id;
    });
    it('should fail to create note', async () => {
      await noteService.createNote(INVALID_ID, createNoteDto).catch((err) => {
        expect(err.status).toBe(400);
      });
    });
    it('should create note', async () => {
      const createdNote = await noteService.createNote(userId, createNoteDto);
      expect(createdNote.title).toBe(createNoteDto.title);
      expect(createdNote.description).toBe(createNoteDto.description);
      expect(createdNote.relatedDate).toBe(createNoteDto.relatedDate);
      noteId = createdNote.id;
    });
  });

  describe('should update note', () => {
    it('should update note', async () => {
      const updatedTodo = await noteService.updateNoteById(
        userId,
        noteId,
        updateNoteDto,
      );
      expect(updatedTodo.title).toBe(updateNoteDto.title);
      expect(updatedTodo.description).toBe(updateNoteDto.description);
      expect(updatedTodo.relatedDate).toBe(updateNoteDto.relatedDate);
    });

    it('should fail to update note (Invalid user id)', async () => {
      await noteService
        .updateNoteById(INVALID_ID, noteId, updateNoteDto)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should fail to update note (Invalid note id)', async () => {
      await noteService
        .updateNoteById(userId, INVALID_ID, updateNoteDto)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
  });

  describe('should delete note', () => {
    it('should fail to delete note (Invalid user id)', async () => {
      await noteService
        .deleteNoteById(INVALID_ID, noteId)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should fail to delete note (Invalid note id)', async () => {
      await noteService
        .deleteNoteById(userId, INVALID_ID)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should return note', async () => {
      await noteService.getNotesById(userId, noteId).then((note) => {
        expect(note).toBeDefined();
        expect(note.id).toBe(noteId);
        expect(note.userId).toBe(userId);
      });
    });
    it('should delete note', async () => {
      const note = await noteService.deleteNoteById(userId, noteId);
      expect(note).toBeUndefined();
    });
    it('should not return deleted note', async () => {
      await noteService
        .getNotesById(userId, noteId)
        .then((note) => expect(note).toBeNull());
    });
  });

  describe('should retrieve notes', () => {
    it('should create 2 notes', async () => {
      await noteService.createNote(userId, createNoteDto);
      await noteService.createNote(userId, createNoteDto);
    });
    it('should retrieve ALL notes', async () => {
      const notes = await noteService.getNotes(userId);
      expect(notes.length).toBe(2);
    });
    it('should retrieve 0 notes', async () => {
      const notes = await noteService.getNotes(INVALID_ID);
      expect(notes.length).toBe(0);
    });
  });

  describe('should retrieve note by id', () => {
    it('should create note', async () => {
      const note = await noteService.createNote(userId, createNoteDto);
      noteId = note.id;
    });
    it('should retrieve note by id', async () => {
      const note = await noteService.getNotesById(userId, noteId);
      expect(note.userId).toBe(userId);
      expect(note.id).toBe(noteId);
    });
    it('should fail to retrieve note by id (Invalid user id)', async () => {
      await noteService
        .getNotesById(INVALID_ID, noteId)
        .then((note) => expect(note).toBeNull());
    });
    it('should fail to retrieve note by id (Invalid note id)', async () => {
      await noteService
        .getNotesById(userId, INVALID_ID)
        .then((note) => expect(note).toBeNull());
    });
  });
});
