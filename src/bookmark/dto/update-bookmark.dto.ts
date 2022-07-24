import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBookmarkDto {
  @ApiPropertyOptional({ example: 'Bookmark Title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Bookmark Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsString()
  @IsOptional()
  link?: string;
}
