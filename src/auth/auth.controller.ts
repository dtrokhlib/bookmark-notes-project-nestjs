import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser, Public } from '../common/decorators';
import { AuthDto } from './dto';
import { JwtRefreshGuard } from '../common/guards';
import { Tokens } from './types';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse()
  @ApiConflictResponse({ description: 'Email is alredy in use' })
  @ApiBody({ type: [AuthDto] })
  @Public()
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: [AuthDto] })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser('id') userId: number) {
    return this.authService.logout(userId);
  }

  @ApiOkResponse()
  @ApiResponse({ status: 409, description: 'Access denied' })
  @Public()
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
