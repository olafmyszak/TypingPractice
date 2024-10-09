import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpStatus,
    Patch,
    Param,
    NotFoundException,
    ConflictException,
    // Patch,
    // Param,
    // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from './entities/user.entity';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { UserStats } from './entities/user-stats.entity';
import { UserStatsResponseDto } from './dto/user-stats-response.dto';

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
        type: UserResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'User already exists.',
    })
    @ApiBody({ type: CreateUserDto })
    async create(
        @Body() createUserDto: CreateUserDto,
    ): Promise<UserResponseDto> {
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
        type: UserResponseDto,
    })
    async findAll(): Promise<UserResponseDto[]> {
        return this.userService.findAll();
    }

    @Patch(':username/stats')
    @ApiOperation({ summary: 'Update user typing performance statistcs' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User stats after updating',
        type: UserStatsResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with the given username was not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Request body is ill-formed',
    })
    async updateUserStats(
        @Param('username') username: string,
        @Body() updateUserStatsdto: UpdateUserStatsDto,
    ): Promise<UserStatsResponseDto> {
        const result = await this.userService.updateStats(
            username,
            updateUserStatsdto,
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
