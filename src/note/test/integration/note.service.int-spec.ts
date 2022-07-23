import { Test } from '@nestjs/testing';
import { use } from 'passport';
import { AppModule } from 'src/app.module';
import { CreateNoteDto, UpdateNoteDto } from 'src/note/dto';
import { NoteService } from 'src/note/note.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('NoteService Int', () => {
  let prismaService: PrismaService;
  let noteService: NoteService;

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

  describe('create Note', () => {
    let userId, noteId;
    it('should create user', async () => {
      const user = await prismaService.user.create({
        data: { email: 'test-int@test.com', hash: '123321' },
      });
      userId = user.id;
    });
    it('should create NOTE', async () => {
      const dto: CreateNoteDto = {
        title: 'My test note',
        description: 'My test note description',
        relatedDate: '2022-07-20T19:28:44+00:00',
      };
      const createdNote = await noteService.createNote(userId, dto);
      expect(createdNote.title).toBe(dto.title);
      expect(createdNote.description).toBe(dto.description);
      expect(createdNote.relatedDate).toBe(dto.relatedDate);

      noteId = createdNote.id;
    });
  });

  describe('should update NOTE', () => {
    let userId, noteId;
    it('should retrieve user', async () => {
      const user = await prismaService.user.findUnique({
        where: {
          email: 'test-int@test.com',
        },
      });
      userId = user.id;
    });
    it('should create NOTE', async () => {
      const dto: CreateNoteDto = {
        title: 'My test note',
        description: 'My test note description',
        relatedDate: '2022-07-20T19:28:44+00:00',
      };
      const createdNote = await noteService.createNote(userId, dto);
      noteId = createdNote.id;
    });
    it('should update NOTE', async () => {
      const dto: UpdateNoteDto = {
        title: 'My test note 2',
        description: 'My test note description 2',
        relatedDate: '2022-08-20T19:28:44+00:00',
      };
      const updatedTodo = await noteService.updateNoteById(userId, noteId, dto);
      expect(updatedTodo.title).toBe(dto.title);
      expect(updatedTodo.description).toBe(dto.description);
      expect(updatedTodo.relatedDate).toBe(dto.relatedDate);
    });
    it('should fail to update NOTE (Invalid user ID)', async () => {
      const dto: UpdateNoteDto = {
        title: 'My test note 2',
        description: 'My test note description 2',
        relatedDate: '2022-08-20T19:28:44+00:00',
      };
      const INVALID_ID = -1;

      await noteService
        .updateNoteById(INVALID_ID, noteId, dto)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should fail to update NOTE (Invalid NOTE id)', async () => {
      const dto: UpdateNoteDto = {
        title: 'My test note 2',
        description: 'My test note description 2',
        relatedDate: '2022-08-20T19:28:44+00:00',
      };
      const INVALID_ID = -1;

      await noteService
        .updateNoteById(userId, INVALID_ID, dto)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
  });

  describe('should delete NOTE', () => {
    let userId, noteId;
    it('should retrieve user', async () => {
      const user = await prismaService.user.findUnique({
        where: {
          email: 'test-int@test.com',
        },
      });
      userId = user.id;
    });
    it('should create NOTE', async () => {
      const dto: CreateNoteDto = {
        title: 'My test note',
        description: 'My test note description',
        relatedDate: '2022-07-20T19:28:44+00:00',
      };
      const createdNote = await noteService.createNote(userId, dto);
      noteId = createdNote.id;
    });

    it('should fail to delete NOTE (Invalid User Id)', async () => {
      const INVALID_ID = -1;

      await noteService
        .deleteNoteById(INVALID_ID, noteId)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should fail to delete NOTE (Invalid NOTE Id)', async () => {
      const INVALID_ID = -1;

      await noteService
        .deleteNoteById(userId, INVALID_ID)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should not return deleted note', async () => {
      await noteService.getNotesById(userId, noteId).then((note) => {
        expect(note.id).toBe(noteId);
        expect(note.userId).toBe(userId);
      });
    });

    it('should  delete NOTE', async () => {
      const note = await noteService.deleteNoteById(userId, noteId);
      expect(note).toBeUndefined();
    });
    it('should not return deleted note', async () => {
      await noteService
        .getNotesById(userId, noteId)
        .then((note) => expect(note).toBeUndefined);
    });
  });

  describe('should retrieve NOTES', () => {
    let userId,
      INVALID_ID = -1;
    it('should retrieve user', async () => {
      const user = await prismaService.user.findUnique({
        where: {
          email: 'test-int@test.com',
        },
      });
      userId = user.id;
    });
    it('should create NOTE', async () => {
      const dto: CreateNoteDto = {
        title: 'My test note',
        description: 'My test note description',
        relatedDate: '2022-07-20T19:28:44+00:00',
      };
      await noteService.createNote(userId, dto);
      await noteService.createNote(userId, dto);
    });
    it('should retrieve ALL notes', async () => {
      const notes = await noteService.getNotes(userId);
      expect(notes.length).toBeGreaterThan(1);
    });
    it('should retrieve 0 notes', async () => {
      const notes = await noteService.getNotes(INVALID_ID);
      expect(notes.length).toBe(0);
    });
  });

  describe('should retrieve NOTES by ID', () => {
    let userId,
      noteId,
      INVALID_ID = -1;
    it('should retrieve user', async () => {
      const user = await prismaService.user.findUnique({
        where: {
          email: 'test-int@test.com',
        },
      });
      userId = user.id;
    });
    it('should create NOTE', async () => {
      const dto: CreateNoteDto = {
        title: 'My test note',
        description: 'My test note description',
        relatedDate: '2022-07-20T19:28:44+00:00',
      };
      const note = await noteService.createNote(userId, dto);
      noteId = note.id;
    });
    it('should retrieve NOTE by Id', async () => {
      const note = await noteService.getNotesById(userId, noteId);
      expect(note.userId).toBe(userId);
      expect(note.id).toBe(noteId);
    });
    it('should fail to retrieve NOTE by Id (invalid user Id)', async () => {
      await noteService
        .getNotesById(INVALID_ID, noteId)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
    it('should fail to retrieve NOTE by Id (invalid NOTE Id)', async () => {
      await noteService
        .getNotesById(userId, INVALID_ID)
        .then((note) => expect(note).toBeUndefined)
        .catch((error) => expect(error.status).toBe(403));
    });
  });
});
