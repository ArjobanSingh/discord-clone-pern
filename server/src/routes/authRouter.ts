import express from 'express';
import {
  login, logout, refreshToken, register,
} from '../controllers/authController';
import isAuthenticated from '../middlewarres/isAuthenticated';
import isValidRefreshToken from '../middlewarres/isValidRefreshToken';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/refresh-token', isValidRefreshToken, refreshToken);
authRouter.post('/login', login);
authRouter.delete('/logout', isAuthenticated, isValidRefreshToken, logout);

export default authRouter;
