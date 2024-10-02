import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
    let controller: UserController;

    const mockUserService = {
        create: jest.fn(async (createUserDto: CreateUserDto): Promise<User> => {
            return Promise.resolve({
                id: 1,
                ...createUserDto,
            });
        }),
        findAll: jest.fn(async (): Promise<User[]> => {
            return Promise.resolve([
                { id: 1, username: 'random', password: '123' },
                { id: 2, username: 'test', password: 'password' },
            ]);
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user and return it', async () => {
            const createUserDto: CreateUserDto = {
                username: 'test',
                password: 'password123',
            };

            const result: User = await controller.create(createUserDto);

            expect(result).toEqual({
                id: 1,
                ...createUserDto,
            });

            expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const result = await controller.findAll();

            expect(result).toEqual([
                { id: 1, username: 'random', password: '123' },
                { id: 2, username: 'test', password: 'password' },
            ]);
        });
    });
});
