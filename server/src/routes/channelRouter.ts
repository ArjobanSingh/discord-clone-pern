import { Router } from 'express';
import { sendChannelMessageRest } from '../controllers/channelController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const channelRouter = Router();

channelRouter.post('/send-message', isAuthenticated, sendChannelMessageRest);

export default channelRouter;
