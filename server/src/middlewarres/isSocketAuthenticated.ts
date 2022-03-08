import { isTokensValidForSocket } from '../utils/helperFunctions';

function isSocketAuthenticated(cb) {
  return async (auth: { accessToken: string, refreshToken: string }, ...rest) => {
    const [isTokenValid, userId] = await isTokensValidForSocket(auth);
    if (!isTokenValid) throw new Error('Not authenticated');
    cb(userId, ...rest);
  };
}

export default isSocketAuthenticated;
