import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createBookmarkDto,
  INVALID_ID,
  updateBookmarkDto,
  userDto,
} from './bookmark.test.data';

describe('Bookmark', () => {
  let prismaService: PrismaService;
  let bookmarkService: BookmarkService;

  let userId: number;
  let bookmarkId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    bookmarkService = moduleRef.get(BookmarkService);

    await prismaService.cleanDb();
  });

  afterAll(async () => {
    await prismaService.onModuleDestroy();
  });

  describe('create bookmark', () => {
    it('should create user', async () => {
      const user = await prismaService.user.create({
        data: { ...userDto },
      });
      expect(user).toBeDefined();
      userId = user.id;
    });
    it('should fail to create bookmark', async () => {
      await bookmarkService
        .createBookmark(INVALID_ID, createBookmarkDto)
        .catch((err) => {
          expect(err.status).toBe(400);
        });
    });
    it('should create bookmark', async () => {
      const bookmark = await bookmarkService.createBookmark(
        userId,
        createBookmarkDto,
      );
      expect(bookmark.title).toBe(createBookmarkDto.title);
      expect(bookmark.description).toBe(createBookmarkDto.description);
      expect(bookmark.link).toBe(createBookmarkDto.link);
      expect(bookmark.userId).toBe(userId);

      bookmarkId = bookmark.id;
    });
  });

  describe('get bookmark by id', () => {
    it('should fail to retrieve bookmark by id (Invalid user id)', async () => {
      await bookmarkService
        .getBookmarkById(INVALID_ID, bookmarkId)
        .then((bookmark) => expect(bookmark).toBeNull());
    });
    it('should fail to retrieve bookmark by id (Invalid bookmark id)', async () => {
      await bookmarkService
        .getBookmarkById(userId, INVALID_ID)
        .then((bookmark) => expect(bookmark).toBeNull());
    });
    it('should retrieve bookmark by id', async () => {
      await bookmarkService
        .getBookmarkById(userId, bookmarkId)
        .then((bookmark) => {
          expect(bookmark.title).toBe(createBookmarkDto.title);
          expect(bookmark.description).toBe(createBookmarkDto.description);
          expect(bookmark.link).toBe(createBookmarkDto.link);
          expect(bookmark.id).toBe(bookmarkId);
          expect(bookmark.userId).toBe(userId);
        });
    });

    describe('update bookmark', () => {
      it('should fail to update bookmark (Invalid user id)', async () => {
        await bookmarkService
          .editBookmarkById(INVALID_ID, bookmarkId, updateBookmarkDto)
          .catch((error) => {
            expect(error.status).toBe(403);
          });
      });
      it('should fail to update bookmark (Invalid bookmark id)', async () => {
        await bookmarkService
          .editBookmarkById(userId, INVALID_ID, updateBookmarkDto)
          .catch((error) => {
            expect(error.status).toBe(403);
          });
      });
      it('should update bookmark', async () => {
        await bookmarkService
          .editBookmarkById(userId, bookmarkId, updateBookmarkDto)
          .then((bookmark) => {
            expect(bookmark.title).toBe(updateBookmarkDto.title);
            expect(bookmark.description).toBe(updateBookmarkDto.description);
            expect(bookmark.link).toBe(updateBookmarkDto.link);
            expect(bookmark.id).toBe(bookmarkId);
            expect(bookmark.userId).toBe(userId);
          });
      });
    });

    describe('delete bookmark', () => {
      it('should fail to delete bookmark (Invalid user id)', async () => {
        await bookmarkService
          .deleteBookmarkById(INVALID_ID, bookmarkId)
          .catch((error) => {
            expect(error.status).toBe(403);
          });
      });
      it('should fail to delete bookmark (Invalid bookmark id)', async () => {
        await bookmarkService
          .deleteBookmarkById(userId, INVALID_ID)
          .catch((error) => {
            expect(error.status).toBe(403);
          });
      });
      it('should delete bookmark', async () => {
        await bookmarkService.deleteBookmarkById(userId, bookmarkId);
        await bookmarkService
          .getBookmarkById(userId, bookmarkId)
          .then((bookmark) => {
            expect(bookmark).toBe(null);
          });
      });
    });

    describe('retrive bookmarks', () => {
      it('should retrieve 2 bookmarks', async () => {
        await bookmarkService.createBookmark(userId, createBookmarkDto);
        await bookmarkService.createBookmark(userId, createBookmarkDto);

        await bookmarkService.getBookmarks(userId).then((bookmarks) => {
          expect(bookmarks).toHaveLength(2);
        });
      });
    });
  });
});
