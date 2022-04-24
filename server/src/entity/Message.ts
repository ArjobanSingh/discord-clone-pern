import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
} from 'class-validator';
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

export const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3mb in bytes

// fileMimeType, fileUrl, fileSize, fileName, fileThumbnail?
@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  fileMimeType: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl()
  fileUrl: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Max(MAX_FILE_SIZE)
  fileSize: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120, {
    message: 'Must be smaller than or equal to 120 characters',
  })
  fileName: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  fileThumbnail: string;

  @Column({ nullable: true })
  fileDimensions: string;

  @Column({ nullable: true })
  filePublicId: string;
}
