import {
  IsDate, IsUUID, Length, Max, Min,
} from 'class-validator';
import { nanoid } from 'nanoid';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

const MAX_DAYS = 7;

export const MIN_MINUTE_LIMIT = 1;
export const MAX_MINUTE_LIMIT = MAX_DAYS * 24 * 60;

@Entity()
export default class InviteLink extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // nanoid
  @Column({ length: 21, default: nanoid() })
  @Length(21, 21)
  urlPath: string;

  @Column({ type: 'smallint' })
  @Min(MIN_MINUTE_LIMIT)
  @Max(MAX_MINUTE_LIMIT)
  minutes: number;

  @Column('uuid')
  @IsUUID()
  serverId: string;

  @Column({ type: 'timestamptz' })
  @IsDate()
  expireAt: Date;

  isExpired() {
    const currentDate = new Date();
    const thisRecordDate = new Date(this.expireAt);

    return currentDate >= thisRecordDate;
  }
}
