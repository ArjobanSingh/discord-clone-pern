import ServerType from './ServerType';
import UserType from './User';

interface ServerMemberType extends UserType {
  isAdmin?: boolean;
  servers?: ServerType[];
}

export default ServerMemberType;
