import { Router } from 'express';
import { getChannelMessages, sendChannelMessageRest } from '../controllers/channelController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const channelRouter = Router();

channelRouter.post('/send-message', isAuthenticated, sendChannelMessageRest);
channelRouter.get('/:serverId/:channelId', isAuthenticated, getChannelMessages);

export default channelRouter;
