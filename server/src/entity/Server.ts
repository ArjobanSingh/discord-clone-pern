import {
  IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength,
} from 'class-validator';
import {
  BaseEntity, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import User from './User';
import ServerMember from './ServerMember';

export enum ServerTypeEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity()
export default class Server extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    @IsNotEmpty()
    @IsString()
    @Length(3, 120)
    name: string;

    @Column({ length: 2000, nullable: true })
    @IsOptional()
    @Length(0, 2000)
    description: string;

    @Column('uuid')
    ownerId: string;

    @Column({ nullable: true })
    avatar: string;

    // this class will store foreign id for User class
    @ManyToOne((type) => User, (user) => user.ownedServers, { onDelete: 'SET NULL' })
    owner: User;

    @OneToMany((type) => ServerMember, (serverMember) => serverMember.server)
    serverMembers: ServerMember[]

    @Column({
      default: 0,
    })
    channelCount: number;

    // easy way to get members count, instead of getting all relations with query
    @Column({
      default: 0,
    })
    memberCount: number;

    @Column({
      type: 'enum',
      enum: ServerTypeEnum,
      default: ServerTypeEnum.PUBLIC,
    })
    @IsEnum(ServerTypeEnum)
    type: ServerTypeEnum

    @Index()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
}
