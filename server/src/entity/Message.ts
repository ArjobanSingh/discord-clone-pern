import { IsEnum, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Channel from './Channel';
import Server from './Server';
import User from './User';

export enum MessageTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE'
}

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  content: string;

  @Column({ default: 'SENT' })
  status: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @Column('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
  })
  @IsEnum(MessageTypeEnum)
  type: MessageTypeEnum

  @ManyToOne(() => Channel, { onDelete: 'CASCADE' })
  channel: Channel;

  @Column('uuid')
  channelId: string;

  @ManyToOne(() => Server, { onDelete: 'CASCADE' })
  server: Server;

  @Column('uuid')
  serverId: string;

  @OneToOne(() => Message)
  @JoinColumn()
  referenceMessage: Message

  @Column('uuid', { nullable: true })
  referenceMessageId: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
