import { ApiProperty } from '@nestjs/swagger';

export class UserStatsResponse {
    @ApiProperty({ example: 20 })
    totalAttempts: number;

    @ApiProperty({ example: 5 })
    successfulAttempts: number;
}
