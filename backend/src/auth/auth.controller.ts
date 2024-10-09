import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            'Username and password are correct and an access token is issued.',
        type: AccessTokenResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Username or password is incorrect and access is denied.',
    })
    @ApiBody({ type: SignInDto })
    async signIn(
        @Body() signInDto: SignInDto,
    ): Promise<AccessTokenResponseDto> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Gets user info' })
    @ApiResponse({
        status: HttpStatus.OK,
        description:
            'Bearer token is valid, so user and token info are returned.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Bearer token is invalid.',
    })
    getProfile(@Request() req: any): any {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return req.user;
    }
}
