import { ServerTypeEnum } from '../entity/Server';
import { MemberRole } from '../entity/ServerMember';

export type AllServersQuery = {
  cursor?: string;
  limit?: string;
}

export type ServerMemberType = {
  userName: string;
  userId: string;
  profilePicture: string;
  role: MemberRole;
}

export type ServerType = {
  id: string;
  name: string;
  ownerId: string;
  type: ServerTypeEnum;
  channelCount: number;
  createdAt: Date;
  updatedAt: Date;
  members: ServerMemberType[];
}
