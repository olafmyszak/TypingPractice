import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpStatus,
    Patch,
    NotFoundException,
    ConflictException,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserStatsDto } from './dto/user-stats.dto';
import { UserStatsResponse } from './dto/user-stats-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new User' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The record has been successfully created.',
        type: CreateUserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User already exists.',
    })
    @ApiBody({ type: CreateUserDto })
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<CreateUserResponseDto> {
        const result = await this.userService.create(createUserDto);

        if (!result) {
            throw new ConflictException(
                `Username '${createUserDto.username}' already exists`,
            );
        }

        return result;
    }

    @Get()
    @ApiOperation({ summary: 'Get all users in the database' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The found records',
        type: CreateUserResponseDto,
    })
    async findAll(): Promise<CreateUserResponseDto[]> {
        return this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('stats')
    @ApiOperation({ summary: 'Get user typing performance statistcs' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User stats',
        type: UserStatsResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given username was not found',
    })
    async getUserStats(@Req() req: any): Promise<UserStatsResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const id: number = req.user.sub;

        const result = await this.userService.getStats(id);

        if (!result) {
            throw new NotFoundException(`User not found`);
        }

        return {
            totalAttempts: result.totalAttempts,
            successfulAttempts: result.successfulAttempts,
        };
    }

    @UseGuards(AuthGuard)
    @Patch('stats')
    @ApiOperation({ summary: 'Update user typing performance statistcs' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User stats after updating',
        type: UserStatsResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given username was not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            'Request body is ill-formed (ensure that successfulAttempts <= totalAttempts)',
    })
    async updateUserStats(
        @Req() req: any,
        @Body() userStatsDto: UserStatsDto,
    ): Promise<UserStatsResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const id: number = req.user.sub;

        const result = await this.userService.updateStats(id, userStatsDto);

        if (!result) {
            throw new NotFoundException(`User not found`);
        }

        return {
            totalAttempts: result.totalAttempts,
            successfulAttempts: result.successfulAttempts,
        };
    }
}
