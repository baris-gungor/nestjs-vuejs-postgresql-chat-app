import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString, IsEmail, Length, IsInt, Min } from 'class-validator';

export namespace UsersDto {
  export class UserLogin {
    @ApiProperty()
    @IsNotEmpty({ message: 'Name should not be empty' })
    @IsString()
    @Length(3, 20)
    readonly username: string;

    @ApiProperty()
    @IsString()
    @Length(3, 20)
    readonly password?: string;
  }
}
