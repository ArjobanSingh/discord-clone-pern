import { IsNotEmpty, Length } from 'class-validator';
import {
  BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
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

    // this class will store foreign id for User class
    @ManyToOne((type) => User, (user) => user.owned_servers, { onDelete: 'SET NULL' })
    owner: User;

    @OneToMany((type) => ServerMember, (serverMember) => serverMember.server)
    serverMembers: ServerMember[]
}
