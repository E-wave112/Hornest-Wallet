import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/users/guards/user.guard';
import { CardService } from './card.service';
import { createCardDto } from './dtos/create-card.dto';
import { UserDecorator } from 'src/users/decorators/user.decorator';
import { updateCardDto } from './dtos/update-card.dto';

@UseGuards(UserAuthGuard)
@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @Post('add')
  async createCard(
    @Body() body: createCardDto,
    @UserDecorator() user: { userId: number },
  ) {
    const { bank, card, cardExpiration, cardCvv, accountNumber } = body;
    const newCard = await this.cardService.create(
      user.userId,
      card,
      cardExpiration,
      cardCvv,
      accountNumber,
      bank,
      // pin,
      // otp,
    );
    return newCard;
  }

  @Put(':id')
  updateCard(@Param('id') id: number, @Body() body: updateCardDto) {
    return this.cardService.update(id, body);
  }

  @Get(':id')
  getCard(@Param('id') id: number) {
    return this.cardService.findOne(id);
  }

  @Get()
  getCards() {
    return this.cardService.find();
  }

  @Delete(':id')
  deleteCard(@Param('id') id: number) {
    return this.cardService.remove(id);
  }
}
