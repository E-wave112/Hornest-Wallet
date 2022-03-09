import { Expose, Type } from 'class-transformer';
import { CardDto } from 'src/card/dtos/response-card.dto';
import { Card } from 'src/card/entities/card.entities';
import { ResponseUserDto } from './response-user.dto';

export class UserDto extends ResponseUserDto {
  @Expose()
  @Type(() => CardDto)
  cards: CardDto[];
}
