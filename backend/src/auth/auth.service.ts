import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        pass: string,
    ): Promise<{ access_token: string }> {
        const user: User | null = await this.userService.findOne(username);

        if (!user) {
            throw new UnauthorizedException();
        }

        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username };
        return { access_token: await this.jwtService.signAsync(payload) };
    }
}
