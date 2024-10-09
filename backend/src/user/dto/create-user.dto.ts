import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
} from 'class-validator';
import { Role } from '../../role/role.enum';

export class CreateUserDto {
    @ApiProperty({
        example: 'swagmaster',
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

    @ApiProperty({
        enum: Role,
        required: true,
        isArray: true,
    })
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(Role, { each: true })
    roles: Role[];
}
