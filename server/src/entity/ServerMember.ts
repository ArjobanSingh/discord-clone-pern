import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import Server from './Server';
import User from './User';

@Entity()
export default class ServerMember extends BaseEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  serverId: string;

  @Column({ type: 'bool', default: false, nullable: true })
  isAdmin: boolean;

  @ManyToOne((type) => User, (user) => user.serverMembers, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne((type) => Server, (server) => server.serverMembers, { onDelete: 'CASCADE' })
  server: Server
}
