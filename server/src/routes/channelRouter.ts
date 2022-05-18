import { Router } from 'express';
import {
  getChannelMessages,
  sendChannelMessage,
  createChannel,
  deleteChannel,
} from '../controllers/channelController';
import uploadFile from '../middlewarres/fileUpload';
import isAuthenticated from '../middlewarres/isAuthenticated';

const channelRouter = Router();

channelRouter.post('/send-message', isAuthenticated, uploadFile, sendChannelMessage);
channelRouter.get('/:serverId/:channelId', isAuthenticated, getChannelMessages);
channelRouter.post('/create-channel', isAuthenticated, createChannel);
channelRouter.delete('/delete-channel/:serverId/:channelId', isAuthenticated, deleteChannel);

export default channelRouter;
