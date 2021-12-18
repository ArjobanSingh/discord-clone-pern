type UserServer = {
  serverName?: string;
  serverId?: string;
  ownerId?: string;
}

export type UserType = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  status: string;
  password: string;
  servers: UserServer[];
}
