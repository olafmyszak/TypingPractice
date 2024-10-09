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
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { UpdateUserStatsResponse } from './dto/update-user-stats-response.dto';
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
    @Patch('stats')
    @ApiOperation({ summary: 'Update user typing performance statistcs' })
    @ApiBearerAuth('JWT-auth')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User stats after updating',
        type: UpdateUserStatsResponse,
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
        @Body() updateUserStatsDto: UpdateUserStatsDto,
    ): Promise<UpdateUserStatsResponse> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const username: string = req.user.username;

        const result = await this.userService.updateStats(
            username,
            updateUserStatsDto,
        );

        if (!result) {
            throw new NotFoundException(`User '${username}' not found`);
        }

        return {
            totalAttempts: result.totalAttempts,
            successfulAttempts: result.successfulAttempts,
        };
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.userService.findOne(+id);
    // }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.userService.update(+id, updateUserDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.userService.remove(+id);
    // }
}
