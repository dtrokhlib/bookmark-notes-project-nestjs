import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  relatedDate?: string;
}
