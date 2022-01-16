import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { userLocalGuard } from './user-local.guard';
import { UserDecorator } from './user.decorator';
import { UserAuthGuard } from './user.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('user/:id')
  async view(@Request() req, @Param() params) {
    console.log(params.id);
    return await this.usersService.viewUser(params.id);
  }

  @UseGuards(userLocalGuard)
  @Post('auth/login')
  async login(@Request() req, @UserDecorator() user: any) {
    // console.log(user);
    return await this.usersService.login(req.body);
  }

  @Post('auth/register')
  async register(@Request() req, @Body() user) {
    console.log('hello world');
    console.log(req.body);
    return await this.usersService.register(req.body);
  }

  @UseGuards(UserAuthGuard)
  @Put('user/update/:id')
  async update(
    @Request() req,
    @Body() user,
    @Param() params,
    @UserDecorator() users: any,
  ) {
    console.log(params.id);
    console.log(users);
    return await this.usersService.updateUser(params.id, req.body);
  }

  // @Post('api/v1/auth/login')
  // async login(@Request() req) {
  //     return await this.usersService.login(req.user);
  // }
}
