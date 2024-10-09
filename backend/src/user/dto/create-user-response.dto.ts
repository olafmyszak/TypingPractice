import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
    @ApiProperty({ example: 1, description: 'The id of the User' })
    id: number;

    @ApiProperty({
        example: 'swagmaster',
        description: 'The username, as chosen by the User',
    })
    username: string;
}
