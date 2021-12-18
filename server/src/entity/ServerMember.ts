import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import Server from './Server';
import User from './User';

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER'
}

export const enumScore = {
  [MemberRole.USER]: 0,
  [MemberRole.MODERATOR]: 1,
  [MemberRole.ADMIN]: 2,
  [MemberRole.OWNER]: 3,
};

@Entity()
export default class ServerMember extends BaseEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  serverId: string;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.USER })
  role: MemberRole;

  @ManyToOne((type) => User, (user) => user.serverMembers, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne((type) => Server, (server) => server.serverMembers, { onDelete: 'CASCADE' })
  server: Server
}
