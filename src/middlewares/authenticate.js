import createHttpError from 'http-errors';

import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) throw createHttpError(401, 'Please provide access token');

  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string')
    throw createHttpError(401, 'Please provide access token');

  const session = await sessionsCollection.findOne({ accessToken });

  if (session === null) throw createHttpError(401, 'Session not found');
  if (Date.now() > session.accessTokenValidUntil)
    throw createHttpError(401, 'Access token expired');

  const user = await usersCollection.findById(session.userId);

  if (user === null) throw createHttpError(404, 'User not found');

  req.user = {
    id: user._id,
    name: user.name,
  };

  next();
};