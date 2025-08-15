import createHttpError from 'http-errors';
import Session from '../db/models/session.js';
import User from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'No token provided');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};