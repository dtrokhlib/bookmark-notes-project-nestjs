import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Bookmark Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Bookmark Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2022-07-20T19:28:44+00:00' })
  @IsDateString()
  @IsOptional()
  relatedDate?: string;
}
