import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({ type: [EditUserDto] })
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
