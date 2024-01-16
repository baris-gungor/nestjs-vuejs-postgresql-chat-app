import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString, IsEmail, Length, IsInt, Min } from 'class-validator';

export namespace ChatDto {
  export class SendMessage {
    readonly id: number;
    readonly createdAt: Date;

    @ApiProperty()
    @IsNotEmpty({ message: 'username should not be empty' })
    @IsString()
    @Length(3, 20)
    readonly username: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'message should not be empty' })
    @Length(1, 200)
    readonly text: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'sendTo should not be empty' })
    @IsString()
    @Length(3, 20)
    readonly sendTo: string;
  }
}
