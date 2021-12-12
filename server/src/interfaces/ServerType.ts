import ServerMemberType from './ServerMemberType';

interface ServerType {
    id: string,
    name: string;
    ownerId: string;
    members?: ServerMemberType[],
  }

export default ServerType;
