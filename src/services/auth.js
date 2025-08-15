import { randomBytes } from 'crypto'; 
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import users from '../db/models/user.js';
import  Session  from '../db/models/session.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000; 
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; 

export const registerUser = async (payload) => {
  const user = await users.findOne({ email: payload.email });
  if (user !== null) throw createHttpError(409, 'Email is already in use!');

  payload.password = await bcrypt.hash(payload.password, 10);
  const newUser = await users.create(payload);

  const { password, ...userData } = newUser.toObject();
  return userData;
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
  const user = await users.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is incorrect');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Email or password is incorrect');

  await Session.deleteOne({ userId: user._id });
  const newSession = createSession();
  const session = await Session.create({
    userId: user._id,
    ...newSession,
  });

  const { password: _, ...userData } = user.toObject();

  return {
    user: userData,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    sessionId: session._id,
  };
};

export const logoutUser = async (sessionId) => {
  await Session.findByIdAndDelete(sessionId);
};

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await Session.findById(sessionId);
  if (!session) throw createHttpError(401, 'Session not found');
  if (session.refreshToken !== refreshToken)
    throw createHttpError(401, 'Refresh token is invalid');
  if (new Date() > session.refreshTokenValidUntil)
    throw createHttpError(401, 'Refresh token expired');

  await Session.findByIdAndDelete(session._id);
  const newSession = createSession();
  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};