import multer from 'multer';
import { MAX_FILE_SIZE } from '../entity/Message';

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('file');

export default uploadFile;
