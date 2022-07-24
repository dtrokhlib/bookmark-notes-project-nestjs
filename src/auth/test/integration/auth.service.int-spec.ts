import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  authDto,
  INVALID_EMAIL,
  INVALID_ID,
  INVALID_PASSWORD,
} from './auth.test.data';

describe('auth', () => {
  let prismaService: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;

  let accessToken: string;
  let refreshToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        JwtModule.register({ secretOrPrivateKey: process.env.JWT_SECRET! }),
      ],
    }).compile();

    prismaService = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    jwtService = moduleRef.get(JwtService);

    await prismaService.cleanDb();
  });

  afterAll(async () => {
    await prismaService.onModuleDestroy();
  });

  describe('auth signup', () => {
    it('auth should signup', async () => {
      const { access_token, refresh_token } = await authService.signup(authDto);
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();

      const payload = await jwtService.verify(access_token);
      expect(payload.email).toBe(authDto.email);

      accessToken = access_token;
      refreshToken = refresh_token;
      userId = payload.sub;
    });
    it('auth should fail to signup (email already in use)', async () => {
      await authService.signup(authDto).catch((error) => {
        expect(error.status).toBe(409);
      });
    });
  });

  describe('auth signin', () => {
    it('auth should signin', async () => {
      const { access_token, refresh_token } = await authService.signin(authDto);
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();

      const payload = await jwtService.verify(access_token);
      expect(payload.email).toBe(authDto.email);
    });
    it('auth should fail to signin (invalid email)', async () => {
      await authService
        .signin({ ...authDto, email: INVALID_EMAIL })
        .catch((error) => {
          expect(error.status).toBe(401);
        });
    });
    it('auth should fail to signin (invalid password)', async () => {
      await authService
        .signin({ ...authDto, password: INVALID_PASSWORD })
        .catch((error) => {
          expect(error.status).toBe(401);
        });
    });
    it('auth should fail to signin (invalid password and email)', async () => {
      await authService
        .signin({ email: INVALID_EMAIL, password: INVALID_PASSWORD })
        .catch((error) => {
          expect(error.status).toBe(401);
        });
    });
  });

  describe('auth refresh token', () => {
    it('should not refresh token (invalid user id)', async () => {
      await authService
        .refreshToken(INVALID_ID, refreshToken)
        .catch((error) => {
          expect(error.status).toBe(403);
        });
    });
    it('should not refresh token (invalid refresh token)', async () => {
      await authService
        .refreshToken(userId, `${refreshToken}1`)
        .catch((error) => {
          expect(error.status).toBe(403);
        });
    });
    it('should refresh token', async () => {
      const { access_token, refresh_token } = await authService.refreshToken(
        userId,
        refreshToken,
      );
      expect(access_token).toBeDefined();
      expect(refresh_token).toBeDefined();

      const payload = await jwtService.verify(access_token);
      expect(payload.email).toBe(authDto.email);

      accessToken = access_token;
      refreshToken = refresh_token;
      userId = payload.sub;
    });
  });

  describe('auth logout', () => {
    it('should logout', async () => {
      await authService.logout(userId);
      await authService.refreshToken(userId, refreshToken).catch((error) => {
        expect(error.status).toBe(403);
      });
    });
  });
});
