import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Channel from './entity/Channel';
import InviteLink from './entity/InviteLink';
import Message from './entity/Message';
import Server from './entity/Server';
import ServerMember from './entity/ServerMember';
import User from './entity/User';

const AppDataSource = new DataSource({
  type: 'postgres',
  synchronize: true,
  logging: true,
  entities: [Channel, InviteLink, Message, Server, ServerMember, User],
  migrations: [],
  subscribers: [],
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
});
// postgres url format: "postgres://username:password@hostname:5432/databasename"
// redis prod url format: redis://username:password@host:port
// redis-local-url redis://localhost:6379

export default AppDataSource;
