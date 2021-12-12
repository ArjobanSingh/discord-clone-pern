import { Router } from 'express';
import { createServer, joinServer } from '../controllers/serverController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const serverRouter = Router();

serverRouter.post('/create-server', isAuthenticated, createServer);
serverRouter.post('/join-server', isAuthenticated, joinServer);

export default serverRouter;
