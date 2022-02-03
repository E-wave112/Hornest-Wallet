import { Controller,UseGuards,Param, Delete,Get,Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { UsersService } from 'src/users/users.service';
import { UserAuthGuard } from '../users/guards/user.guard';
import { UserDecorator } from '../users/decorators/user.decorator';
import { Transactions } from './entities/transactions.entity';
import { Request } from 'express';
@Controller('transactions')
export class TransactionsController {
    constructor(
        private transactionService: TransactionsService,
        private userService: UsersService
    ) {}

    @UseGuards(UserAuthGuard)
    @Get('user')
    async getUserTransactions(@UserDecorator() user: any):Promise<Transactions[]|string> {
        return await this.transactionService.viewUserTransactions({
            where: { user: { id: user.userId } }
        });
    }

    @UseGuards(UserAuthGuard)
    @Delete('delete/:id')
    async deleteUserTransaction(@Param('id') id:string, @Req() request: Request,):Promise<string> {
        await this.transactionService.deleteUserTransaction(id);
        return "transaction deleted successfully"
    }
        
}
