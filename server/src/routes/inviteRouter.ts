import express from 'express';
import { createInvite } from '../controllers/inviteController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const inviteRouter = express.Router();

inviteRouter.post('/', isAuthenticated, createInvite);

export default inviteRouter;
