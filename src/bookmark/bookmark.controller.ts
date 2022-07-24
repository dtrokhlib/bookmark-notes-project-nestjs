import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../common/decorators';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@ApiUnauthorizedResponse()
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Invalid user id' })
  @ApiBody({ type: [CreateBookmarkDto] })
  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({ type: [UpdateBookmarkDto] })
  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(userId, bookmarkId, dto);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Access denied' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
