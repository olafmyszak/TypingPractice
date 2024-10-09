import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../role/role.enum';

describe('UserService', () => {
    let service: UserService;

    // Define the type for mock repository methods, so that eslint stops complaining
    interface MockUserRepository {
        create: (dto: CreateUserDto) => User;
        save: (user: User) => Promise<User>;
        find: () => Promise<User[]>;
    }

    const mockUserRepository: MockUserRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user and return it', async () => {
            // Arrange
            const dto: CreateUserDto = {
                username: 'test',
                password: 'password',
                roles: [Role.User],
            };

            jest.spyOn(mockUserRepository, 'create').mockImplementation(
                (createUserDto: CreateUserDto): User => {
                    return {
                        id: Date.now(),
                        ...createUserDto,
                    };
                },
            );

            const createdUser: User = mockUserRepository.create(dto);

            jest.spyOn(mockUserRepository, 'save').mockImplementation(
                async (user: User): Promise<User> => {
                    return Promise.resolve(user);
                },
            );

            // Act
            const result: User = await service.create(dto);

            // Assert
            expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
            expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
            expect(result).toEqual(createdUser);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            // Arrange
            const users: User[] = [
                {
                    id: 1,
                    username: 'random',
                    password: '123',
                    roles: [Role.User],
                },
                {
                    id: 2,
                    username: 'test',
                    password: 'password',
                    roles: [Role.User],
                },
            ];

            jest.spyOn(mockUserRepository, 'find').mockResolvedValue(users);

            // Act
            const result: User[] = await service.findAll();

            // Assert
            expect(mockUserRepository.find).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });
});
