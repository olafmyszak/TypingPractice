import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../auth/role/role.enum';
import { UserStats } from './user-stats.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, array: true })
    roles: Role[];

    @OneToOne(() => UserStats, { eager: true, cascade: true })
    @JoinColumn()
    stats: UserStats;
}
