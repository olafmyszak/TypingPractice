import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignInDto {
    @ApiProperty({
        example: 'swagmaster69',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'password',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
