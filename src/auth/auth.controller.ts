import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { AuthDto } from './dto/auth.dto';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtGuard } from './guard/jwt.guard';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshTokens(
    @GetUser('id') id: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(id, refreshToken);
  }
}
