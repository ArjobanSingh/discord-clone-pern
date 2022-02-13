import {
  IsEnum,
  IsNotEmpty,
  IsString,
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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Server from './Server';

export enum ChannelTypeEnum {
  TEXT = 'text',
  AUDIO = 'audio',
}

// TODO: add private/public
@Entity()
export default class Channel extends BaseEntity {
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

  @Column({
    type: 'enum',
    enum: ChannelTypeEnum,
    default: ChannelTypeEnum.TEXT,
  })
  @IsEnum(ChannelTypeEnum)
  type: ChannelTypeEnum;

  @ManyToOne((type) => Server, (server) => server.channels)
  server: Server;

  @Column('uuid')
  serverId: string;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
