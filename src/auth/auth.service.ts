import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup({ email, password }: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(password);
    // save the user in the db
    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          hash,
        },
      });

      const tokens = await this.signTokens(user.id, user.email);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email is alredy in use');
        }
      }
      throw error;
    }
  }

  async signin({ email, password }: AuthDto) {
    // fins the user by email
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    // if user does not exist throw exception
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare password
    const passwordMatches = await argon.verify(user.hash, password);

    // if password does not match throw exception
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashed_refresh: {
          not: null,
        },
      },
      data: {
        hashed_refresh: null,
      },
    });
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashed_refresh) {
      throw new ForbiddenException('Access denied');
    }

    const refreshTokenMatches = await argon.verify(
      user.hashed_refresh,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  private async signTokens(userId: number, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 15, // 15 mins
        secret: this.configService.get('JWT_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: 60 * 60 * 24, // 1 Day
        secret: this.configService.get('RT_SECRET'),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshTokenHash(userId: number, refresh_token: string) {
    const hash = await argon.hash(refresh_token);
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashed_refresh: hash,
      },
    });
  }
}
