import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000; 
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; 

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });

  if (user !== null) throw createHttpError(409, 'Email is already in use!');

  payload.password = await bcrypt.hash(payload.password, 10);

  return usersCollection.create(payload);
};

function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

export const loginUser = async (email, password) => {
  const user = await usersCollection.findOne({ email });

  if (user === null)
    throw createHttpError(401, 'Email or password is incorrect');
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true)
    throw createHttpError(401, 'Email or password is incorrect');

  await sessionsCollection.deleteOne({ userId: user._id });
  const newSession = createSession();

  return await sessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await sessionsCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await sessionsCollection.findById(sessionId);

  if (session === null) throw createHttpError(401, 'Session not found');
  if (session.refreshToken !== refreshToken)
    throw createHttpError(401, 'Refresh token is invalid');
  if (Date.now() > session.refreshTokenValidUntil)
    throw createHttpError(401, 'Refresh token expired');

  await sessionsCollection.deleteOne({ _id: session._id });
  const newSession = createSession();

  return await sessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
