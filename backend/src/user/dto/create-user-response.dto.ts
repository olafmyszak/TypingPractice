import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/role/role.enum';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserResponseDto {
    @ApiProperty({ example: 1, description: 'The id of the User' })
    id: number;

    @ApiProperty({
        example: 'swagmaster',
        description: 'The username, as chosen by the User',
    })
    username: string;

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
