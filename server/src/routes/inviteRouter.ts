import express from 'express';
import { createInvite, verifyUrl } from '../controllers/inviteController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const inviteRouter = express.Router();

inviteRouter.post('/', isAuthenticated, createInvite);
inviteRouter.get('/:inviteLink', isAuthenticated, verifyUrl);

export default inviteRouter;
