import { IsNotEmpty, Length } from 'class-validator';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Server extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    @IsNotEmpty()
    @Length(3, 120)
    name: string;

    // this class will store foreign id for User class
    @ManyToOne((type) => User, (user) => user.owned_servers)
    owner: User;
}
