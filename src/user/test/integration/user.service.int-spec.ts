import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { INVALID_ID, updateUserDto, userDto } from './user.test.data';

describe('User', () => {
  let prismaService: PrismaService;
  let userService: UserService;

  let userId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    userService = moduleRef.get(UserService);

    await prismaService.cleanDb();
  });

  afterAll(async () => {
    prismaService.onModuleDestroy();
  });

  describe('update user', () => {
    it('should create user', async () => {
      const user = await prismaService.user.create({
        data: {
          ...userDto,
        },
      });
      expect(user.email).toBe(userDto.email);
      expect(user.hash).toBe(userDto.hash);
      userId = user.id;
    });
    it('should fail to update user', async () => {
      await userService.editUser(INVALID_ID, updateUserDto).catch((error) => {
        expect(error.status).toBe(400);
      });
    });
    it('should update user', async () => {
      await userService.editUser(userId, updateUserDto).then((user) => {
        expect(user.id).toBe(userId);
        expect(user.email).toBe(updateUserDto.email);
        expect(user.firstName).toBe(updateUserDto.firstName);
        expect(user.lastName).toBe(updateUserDto.lastName);
      });
    });
  });
});
