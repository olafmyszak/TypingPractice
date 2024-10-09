import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatsResponse {
    @ApiProperty({ example: 20 })
    totalAttempts: number;

    @ApiProperty({ example: 5 })
    successfulAttempts: number;
}
