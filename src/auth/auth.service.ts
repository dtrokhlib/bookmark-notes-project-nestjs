import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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

      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
