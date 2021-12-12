import ServerType from './ServerType';

interface ServerMemberType {
  id: string,
  email: string;
  name: string;
  profilePicture?: string;
  status?: string;
  isAdmin?: boolean;
  servers?: ServerType[];
}

export default ServerMemberType;
