import { Router } from 'express';
import {
  createServer, getAllServers, getServerDetails, joinServer,
} from '../controllers/serverController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const serverRouter = Router();

serverRouter.get('/', isAuthenticated, getAllServers);
serverRouter.get('/:serverId', isAuthenticated, getServerDetails);
serverRouter.post('/create-server', isAuthenticated, createServer);
serverRouter.post('/join-server', isAuthenticated, joinServer);

export default serverRouter;
