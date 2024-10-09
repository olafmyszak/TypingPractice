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

export interface UserStatsDto {
    totalAttempts: number;
    successfulAttempts: number;
}

export interface UserStatsResponse {
    totalAttempts: number;
    successfulAttempts: number;
}
