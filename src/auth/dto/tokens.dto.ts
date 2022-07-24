import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}
