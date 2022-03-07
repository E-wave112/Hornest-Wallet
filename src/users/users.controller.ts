import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDecorator } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user-dto';
import { LogInUserDto } from './dto/login-user-dto';
import { User } from './entities/users.entity';
import { userLocalGuard } from './guards/user-local.guard';
import { UserAuthGuard } from './guards/user.guard';
import { UsersService } from './users.service';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDto)
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('user')
  async view(@UserDecorator() user: { userId: number }) {
    return await this.usersService.viewUser(user.userId);
  }

  @UseGuards(userLocalGuard)
  @ApiOkResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() body: LogInUserDto) {
    return await this.usersService.login(body);
  }

  @Post('auth/register')
  @HttpCode(201)
  @ApiOkResponse({ status: HttpStatus.CREATED })
  @ApiOperation({ summary: 'register a user' })
  async register(@Body() body: CreateUserDto) {
    return await this.usersService.register(body);
  }

  @Serialize(ResponseUserDto)
  @UseGuards(UserAuthGuard)
  @Put('user/update/:id')
  async update(
    @Body() body,
    @Param('id') id: number,
    @UserDecorator() user: any,
  ) {
    return await this.usersService.updateUser(id, body);
  }
}
