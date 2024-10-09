enum Role {
    User = 'user',
    Admin = 'admin',
}

interface UserStats {
    id: number;
    totalAttempts: number;
    successfulAttempts: number;
}

export interface User {
    id: number;
    username: string;
    password: string;
    roles: Role[];
    stats: UserStats;
}

export interface RegisterUserDto {
    username: string;
    password: string;
}

export interface UserRegistrationResponse {
    id: number;
    username: string;
}

export interface SignInDto {
    username: string;
    password: string;
}

export interface UpdateUserStatsDto {
    totalAttempts: number;
    successfulAttempts: number;
}

export interface UpdateUserStatsResponse {
    totalAttempts: number;
    successfulAttempts: number;
}
