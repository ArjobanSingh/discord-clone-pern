import ServerMemberType from '../interfaces/ServerMemberType';

export type AllServersQuery = {
    cursor?: string;
    limit?: string;
}

export type ServerType = {
    id: string,
    name: string;
    ownerId: string;
    members?: ServerMemberType[],
}
