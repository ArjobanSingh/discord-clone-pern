import multer from 'multer';
import { MAX_FILE_SIZE } from '../entity/Message';
import { CustomError } from '../utils/errors';

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('file');

export const uploadSingleImage = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    const { mimetype: type } = file;
    if (!type.match('image.*')) {
      callback(new CustomError('Only Images are allowed', 400));
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export const uploadServerMultipleFiles = uploadSingleImage.fields([{
  name: 'avatar',
  maxCount: 1,
}, {
  name: 'banner',
  maxCount: 1,
}]);

export const uploadServerAvatar = uploadSingleImage.single('avatar');
export const uploadUserProfilePic = uploadSingleImage.single('profilePicture');

export default uploadFile;
