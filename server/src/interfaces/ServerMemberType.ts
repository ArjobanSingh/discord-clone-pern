interface ServerMemberType {
  id: string,
  email: string;
  name: string;
  profilePicture?: string;
  status?: string;
  isAdmin?: boolean;
}

export default ServerMemberType;
