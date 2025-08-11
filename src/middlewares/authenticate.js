import createHttpError from 'http-errors';
import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw createHttpError(401, 'Please provide access token');
    }

    const [bearer, accessToken] = authorization.split(' ');
    if (bearer !== 'Bearer' || !accessToken) {
      throw createHttpError(401, 'Please provide access token');
    }

    const session = await sessionsCollection.findOne({ accessToken });
    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    if (Date.now() > session.accessTokenValidUntil.getTime()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await usersCollection.findById(session.userId);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};