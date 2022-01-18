import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The user's email",
    required: true,
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @ApiProperty({
    description: "The user's password",
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The user's first name",
    required: true,
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "The user's last name",
    required: true,
  })
  lastName: string;
}
