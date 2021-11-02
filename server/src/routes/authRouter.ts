import express from 'express';
import { login, refreshToken, register } from '../controllers/authController';
import isValidRefreshToken from '../middlewarres/isValidRefreshToken';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/refresh-token', isValidRefreshToken, refreshToken);
authRouter.post('/login', login);

export default authRouter;
