import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: "The user id",
    required: true,
  })
  user: number;

  @ApiProperty()
  balance?: number;
}
