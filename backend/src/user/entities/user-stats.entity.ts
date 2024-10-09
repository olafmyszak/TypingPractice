import { Column, Check, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Check('"totalAttempts" >= "successfulAttempts"')
export class UserStats {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    totalAttempts: number;

    @Column({ default: 0 })
    successfulAttempts: number;
}
