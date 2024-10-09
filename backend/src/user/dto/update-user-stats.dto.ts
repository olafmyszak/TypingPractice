import { IsNotEmpty, IsPositive, Validate } from 'class-validator';
import { TotalAttemptsGreaterOrEqualToSuccessfulAttempts } from './validators/attempts';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserStatsDto {
    @ApiProperty({
        example: 20,
        required: true,
    })
    @IsNotEmpty()
    @IsPositive()
    @Validate(TotalAttemptsGreaterOrEqualToSuccessfulAttempts)
    totalAttempts: number;

    @ApiProperty({
        example: 5,
        required: true,
    })
    @IsNotEmpty()
    @IsPositive()
    successfulAttempts: number;
}
