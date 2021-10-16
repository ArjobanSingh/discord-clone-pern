import jwt from 'jsonwebtoken';
import UserType from '../interfaces/User';

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

const createUserObject = (user: UserType) => {
  const {
    email, name, status, profile_picture: profilePicture, id,
  } = user;
  return {
    id,
    email,
    name,
    status,
    profilePicture,
  };
};

const createAccessToken = (userId: string) => (
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION })
);
const createRefreshToken = (userId: string) => (
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
);

export {
  createUserObject,
  createAccessToken,
  createRefreshToken,
};
