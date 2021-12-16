import { IsNotEmpty, Length } from 'class-validator';
import {
  BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import User from './User';
import ServerMember from './ServerMember';

@Entity()
export default class Server extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    @IsNotEmpty()
    @Length(3, 120)
    name: string;

    @Column('uuid')
    ownerId: string;

    // this class will store foreign id for User class
    @ManyToOne((type) => User, (user) => user.ownedServers, { onDelete: 'SET NULL' })
    owner: User;

    @OneToMany((type) => ServerMember, (serverMember) => serverMember.server)
    serverMembers: ServerMember[]

    @Column({
      default: 0,
    })
    channelCount: number;

    @Index()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
