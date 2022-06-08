/* eslint-disable no-throw-literal */
// import { getConnection } from 'typeorm';
import AppDataSource from '../data-source';
import Channel from '../entity/Channel';
import Server from '../entity/Server';
import { UserType } from '../types/UserTypes';

export const getUserData = async (
  userId: string | undefined = undefined,
  email: string | undefined = undefined,
): Promise<UserType[]> => {
  if (!userId && !email) throw 'Something went wrong in finding user';

  // const condition = userId ? `u.id = '${userId}'` : `u.email = '${email}'`;
  const condition = userId ? 'u.id =' : 'u.email =';
  const conditionValue = userId || email;
  const response: UserType[] = await AppDataSource.query(`
    SELECT u.id, u.name, u.email, u.status, u."profilePicture", u.password,
    json_agg(json_build_object(
      'serverName', s.name, 'serverId', s.id, 'ownerId', s."ownerId", 'avatar', s.avatar
    )) as servers
    FROM users "u"
    LEFT JOIN server_member "sm" ON  u.id = sm."userId"
    LEFT JOIN server "s" ON s.id = sm."serverId"
    WHERE ${condition} $1
    group by u.id
    limit 1;
`, [conditionValue]);

  if (!response || !response[0]) return response;

  const [user] = response;

  // user who is not in any server, it returns array of one object, with all server details as null
  if (user.servers.length === 1 && !user.servers[0].serverId) {
    user.servers = [];
  }
  return [user];
};

export interface ServerData extends Server {
  channels: Channel[],
  members: {
    userName: string,
    userId: string,
    profilePicture?: string,
    role: string,
  }[],
}

const removeDuplicatesAndEmpty = (objectArr: Array<unknown>, uniqueKey: string) => {
  const set = new Set();
  const newArr = [];
  objectArr.forEach((element) => {
    if (!element[uniqueKey]) return;
    if (set.has(element[uniqueKey])) return;
    set.add(element[uniqueKey]);
    newArr.push(element);
  });
  return newArr;
};

export const getServerData = async (serverId: String): Promise<ServerData | undefined> => {
  const [server] = await AppDataSource.query(`
  SELECT s.*,
    json_agg(json_build_object(
      'userName', u.name, 'userId', u.id, 'profilePicture', u."profilePicture", 'role', sm.role
    )) as members,
    json_agg(json_build_object(
    'name', c.name, 'id', c.id, 'serverId', c."id", 'createdAt', c."createdAt",
    'updatedAt', c."updatedAt", 'type', c.type
    )) as channels
  FROM "server" s
  INNER JOIN "server_member" sm ON sm."serverId"= s."id"
  INNER JOIN "users" u ON u."id"= sm."userId"
  LEFT JOIN "channel" c ON c."serverId" = s."id"
  WHERE s."id" = $1
  Group by s.id
  limit 1;
`, [serverId]);

  if (!server) return server;

  // in case this server does not have any channel,
  // this query will return array(length equal to other members array)
  // of objects with undefined entries
  server.channels = removeDuplicatesAndEmpty(server.channels, 'id');
  server.members = removeDuplicatesAndEmpty(server.members, 'userId');
  return server;
};

// two apis for getting server and its channels approach
// const serverDetailsPromise = AppDataSource.query(
//   `
//   SELECT s.*,
//   json_agg(json_build_object(
//     'userName', u.name, 'userId', u.id, 'profilePicture', u."profilePicture", 'role', sm.role
//   )) as members
//   FROM server "s"
//   INNER JOIN server_member "sm" ON  s.id = sm."serverId"
//   INNER JOIN users "u" ON u.id = sm."userId"
//   WHERE s.id = $1
//   group by s.id
//   limit 1;
// `,
//   [serverId],
// );

// const getChannelsPromise = Channel.find({
//   where: { serverId },
// });

// const [serverData, serverChannels] = await Promise.all([
//   serverDetailsPromise,
//   getChannelsPromise,
// ]);

// const [server] = serverData;
