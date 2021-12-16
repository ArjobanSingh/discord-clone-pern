/* eslint-disable no-throw-literal */
import { getConnection } from 'typeorm';
import ServerMemberType from '../interfaces/ServerMemberType';

// const [user] = await getConnection().query(`
// select u.*, sa.servers from users u
// JOIN (Select sm."userId" as id,
//   json_agg(
//     json_build_object('serverName', s.name, 'serverId', s.id, 'ownerId', s."ownerId")
//   ) as servers from server_member sm
//   join server s on sm."serverId" = s.id
//   Group by sm."userId") sa using (id)
//   where u.id = '${userId}'
//   limit 1;
// `);

// TODO: user who is not in any server, it returns array of one object, with all server details as null
export const getUserData = (
  userId: string | undefined = undefined,
  email: string | undefined = undefined,
): Promise<ServerMemberType[]> => {
  if (!userId && !email) throw 'Something went wrong in finding user';

  const condition = userId ? `u.id = '${userId}'` : `u.email = '${email}'`;
  return getConnection().query(`
    SELECT u.*,
    json_agg(json_build_object('serverName', s.name, 'serverId', s.id, 'ownerId', s."ownerId")) as servers
    FROM users "u"
    LEFT JOIN server_member "sm" ON  u.id = sm."userId"
    LEFT JOIN server "s" ON s.id = sm."serverId"
    WHERE ${condition}
    group by u.id
    limit 1;
`);
};

export const test = 'test';

// SELECT u.*, s.id as server_id, s.name as server_name
// FROM users "u"
// LEFT JOIN server_member "sm" ON  u.id = sm."userId"
// LEFT JOIN public.server "s" ON s.id = sm."serverId"
// -- WHERE u.email = 'ask@mail.co'
// -- limit 1;
