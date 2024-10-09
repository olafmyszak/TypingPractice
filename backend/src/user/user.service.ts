import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStats } from './entities/user-stats.entity';
import { UserStatsDto } from './dto/user-stats.dto';
import { Role } from '../auth/role/role.enum';

const saltRounds = 10;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserStats)
        private userStatsRepository: Repository<UserStats>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User | null> {
        const usernameExists = await this.usersRepository.existsBy({
            username: createUserDto.username,
        });

        if (usernameExists) {
            return null;
        }

        const user = this.usersRepository.create(createUserDto);
        user.password = await bcrypt.hash(user.password, saltRounds);
        user.roles = [Role.User];
        user.stats = new UserStats();

        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOneByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ username });
    }

    async getStats(id: number) {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            return null;
        }

        return user.stats;
    }

    async updateStats(id: number, updateUserStatsdto: UserStatsDto) {
        const user = await this.usersRepository.findOneBy({ id });

        if (!user) {
            return null;
        }

        await this.userStatsRepository.update(
            user.stats.id,
            updateUserStatsdto,
        );

        return this.userStatsRepository.findOneByOrFail({ id: user.stats.id });
    }
}
