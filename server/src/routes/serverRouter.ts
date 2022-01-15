import { Router } from 'express';
import {
  createServer,
  deleteServer,
  getAllServers,
  getServerDetails,
  joinServer,
  leaveServer,
  updateServer,
  updateServerMemberRoles,
} from '../controllers/serverController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const serverRouter = Router();

serverRouter.get('/', isAuthenticated, getAllServers);
serverRouter.get('/:serverId', isAuthenticated, getServerDetails);
serverRouter.post('/create-server', isAuthenticated, createServer);
serverRouter.post('/join-server', isAuthenticated, joinServer);
serverRouter.put('/update-server', isAuthenticated, updateServer);
serverRouter.put('/update-roles', isAuthenticated, updateServerMemberRoles);
serverRouter.delete('/delete-server/:serverId', isAuthenticated, deleteServer);
serverRouter.delete('/leave-server/:serverId', isAuthenticated, leaveServer);

export default serverRouter;
