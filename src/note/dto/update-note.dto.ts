import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ example: 'Bookmark Title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Bookmark Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2022-07-20T19:28:44+00:00' })
  @IsDateString()
  @IsOptional()
  relatedDate?: string;
}
