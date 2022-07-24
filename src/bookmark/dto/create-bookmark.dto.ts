import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ example: 'Bookmark Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Bookmark Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://google.com' })
  @IsString()
  @IsNotEmpty()
  link: string;
}
