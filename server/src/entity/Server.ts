import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import ServerMember from './ServerMember';
import Channel from './Channel';

export enum ServerTypeEnum {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity()
export default class Server extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  @IsString()
  @IsNotEmpty({ message: 'Cannot be empty' })
  @MinLength(3, { message: 'Must be longer than or equal to 3 characters' })
  @MaxLength(120, {
    message: 'Must be smaller than or equal to 120 characters',
  })
  name: string;

  @Column({ length: 2000, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Must be smaller than or equal to 2000 characters',
  })
  description: string;

  @Column('uuid')
  ownerId: string;

  @IsOptional()
  @IsUrl()
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  avatarPublicId: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  banner: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  bannerPublicId: string;

  // this class will store foreign id for User class
  @ManyToOne((type) => User, (user) => user.ownedServers, {
    onDelete: 'SET NULL',
  })
  owner: User;

  @OneToMany((type) => ServerMember, (serverMember) => serverMember.server)
  serverMembers: ServerMember[];

  @OneToMany((type) => Channel, (channel) => channel.server)
  channels: Channel[];

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
  type: ServerTypeEnum;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
